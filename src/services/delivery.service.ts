import { deliveryRepo } from "../db/repositories/delivery.repo";
import { pipelineRepo } from "../db/repositories/pipeline.repo";








const MAX_ATTEMPTS = 3;
const BACKOFF_DELAYS = [
    1 * 60 * 1000, // 1 minute
    5 * 60 * 1000, // 5 minutes
    15 * 60 * 1000 // 15 minutes
];


export const deliveryService = {
    deliverResult: async (
        jobId: string,
        pipelineId: string,
        result: Record<string, unknown>
    ): Promise<void> => {
        const subscribers = await pipelineRepo.findSubscribers(pipelineId);
        const activeSubscribers = subscribers.filter(sub => sub.isActive);

        if (activeSubscribers.length === 0) {
            console.warn(`No active subscribers found for pipeline: ${pipelineId}`);
            return;
        }
        await Promise.allSettled(
            activeSubscribers.map(subscriber =>
                deliverToSubscriber(jobId, subscriber.id, subscriber.url, result, 1)
            ));

    },

    retryFailedDeliveries: async (): Promise<void> => {
        const pendingRetries = await deliveryRepo.findPendingRetries();
        if (pendingRetries.length === 0) {
            console.info('No pending deliveries to retry');
            return;
        }
        console.log(`Retrying ${pendingRetries.length} failed deliveries...`);
        for (const attempt of pendingRetries) {
            await retryDelivery(attempt);
        }
    },
}

const retryDelivery = async (attempt: any): Promise<void> => {
    const nextAttemptNumber = attempt.attemptNumber + 1;

    if (nextAttemptNumber > MAX_ATTEMPTS) {
        console.log(`Max attempts reached for delivery ${attempt.id}`);
        return;
    }

    // Re-fetch the result from the job
    const { jobRepo } = await import('@/db/repositories/job.repo');
    const job = await jobRepo.findById(attempt.jobId);

    if (!job || !job.result) {
        console.log(`Job ${attempt.jobId} not found or has no result`);
        return;
    }

    // Get subscriber URL
    const { db } = await import('@/db');
    const { subscribers } = await import('@/db/schema/pipelines');
    const { eq } = await import('drizzle-orm');

    const subResult = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.id, attempt.subscriberId))
        .limit(1);

    if (!subResult[0]) return;

    await deliverToSubscriber(
        attempt.jobId,
        attempt.subscriberId,
        subResult[0].url,
        job.result as Record<string, unknown>,
        nextAttemptNumber
    );
};

const deliverToSubscriber = async (
    jobId: string,
    subscriberId: string,
    url: string,
    result: Record<string, unknown>,
    attemptNumber: number
): Promise<void> => {

    // Create a delivery attempt record
    const attempt = await deliveryRepo.create({ jobId, subscriberId, attemptNumber });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        const responseBody = await response.text();

        if (response.ok) {
            // ✅ Success
            await deliveryRepo.markSuccess(attempt.id, response.status, responseBody);
            console.log(`Delivered to ${url} — status ${response.status}`);
        } else {
            // ❌ HTTP error (4xx, 5xx)
            throw new Error(`Subscriber returned ${response.status}: ${responseBody}`);
        }

    } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';

        // Calculate next retry time using backoff
        const nextRetryAt = calculateNextRetry(attemptNumber);
        if (nextRetryAt !== null) {
            await deliveryRepo.markFailed(attempt.id, error, nextRetryAt);
        } else {
            console.log(`No more retries left for delivery ${attempt.id}`); 
        }

        if (nextRetryAt) {
            console.log(`Delivery to ${url} failed (attempt ${attemptNumber}), retrying at ${nextRetryAt.toISOString()}`);
        } else {
            console.log(`Delivery to ${url} failed permanently after ${attemptNumber} attempts`);
        }
    }
};

const calculateNextRetry = (attemptNumber: number): Date | null => {
    const delayMs = BACKOFF_DELAYS[attemptNumber - 1];

    // No more retries after max attempts
    if (!delayMs) return null;

    return new Date(Date.now() + delayMs);
};