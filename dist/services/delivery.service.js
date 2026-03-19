"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryService = void 0;
const delivery_repo_1 = require("../db/repositories/delivery.repo");
const pipeline_repo_1 = require("../db/repositories/pipeline.repo");
const job_repo_1 = require("../db/repositories/job.repo");
const db_1 = require("../db");
const pipelines_1 = require("../db/schema/pipelines");
const drizzle_orm_1 = require("drizzle-orm");
const MAX_ATTEMPTS = 3;
const BACKOFF_DELAYS = [
    1 * 60 * 1000, // 1 minute
    5 * 60 * 1000, // 5 minutes
    15 * 60 * 1000 // 15 minutes
];
exports.deliveryService = {
    deliverResult: async (jobId, pipelineId, result) => {
        const subscribers = await pipeline_repo_1.pipelineRepo.findSubscribers(pipelineId);
        const activeSubscribers = subscribers.filter(sub => sub.isActive);
        if (activeSubscribers.length === 0) {
            console.warn(`No active subscribers found for pipeline: ${pipelineId}`);
            return;
        }
        await Promise.allSettled(activeSubscribers.map(subscriber => deliverToSubscriber(jobId, subscriber.id, subscriber.url, result, 1)));
    },
    retryFailedDeliveries: async () => {
        const pendingRetries = await delivery_repo_1.deliveryRepo.findPendingRetries();
        if (pendingRetries.length === 0) {
            console.info('No pending deliveries to retry');
            return;
        }
        console.log(`Retrying ${pendingRetries.length} failed deliveries...`);
        for (const attempt of pendingRetries) {
            await retryDelivery(attempt);
        }
    },
};
const retryDelivery = async (attempt) => {
    const nextAttemptNumber = attempt.attemptNumber + 1;
    if (nextAttemptNumber > MAX_ATTEMPTS) {
        console.log(`Max attempts reached for delivery ${attempt.id}`);
        return;
    }
    // Re-fetch the result from the job
    const job = await job_repo_1.jobRepo.findById(attempt.jobId);
    if (!job || !job.result) {
        console.log(`Job ${attempt.jobId} not found or has no result`);
        return;
    }
    const subResult = await db_1.db
        .select()
        .from(pipelines_1.subscribers)
        .where((0, drizzle_orm_1.eq)(pipelines_1.subscribers.id, attempt.subscriberId))
        .limit(1);
    if (!subResult[0])
        return;
    await deliverToSubscriber(attempt.jobId, attempt.subscriberId, subResult[0].url, job.result, nextAttemptNumber);
};
const deliverToSubscriber = async (jobId, subscriberId, url, result, attemptNumber) => {
    // Create a delivery attempt record
    const attempt = await delivery_repo_1.deliveryRepo.create({ jobId, subscriberId, attemptNumber });
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
            await delivery_repo_1.deliveryRepo.markSuccess(attempt.id, response.status, responseBody);
            console.log(`Delivered to ${url} — status ${response.status}`);
        }
        else {
            // ❌ HTTP error (4xx, 5xx)
            throw new Error(`Subscriber returned ${response.status}: ${responseBody}`);
        }
    }
    catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        // Calculate next retry time using backoff
        const nextRetryAt = calculateNextRetry(attemptNumber);
        if (nextRetryAt !== null) {
            await delivery_repo_1.deliveryRepo.markFailed(attempt.id, error, nextRetryAt);
        }
        else {
            console.log(`No more retries left for delivery ${attempt.id}`);
        }
        if (nextRetryAt) {
            console.log(`Delivery to ${url} failed (attempt ${attemptNumber}), retrying at ${nextRetryAt.toISOString()}`);
        }
        else {
            console.log(`Delivery to ${url} failed permanently after ${attemptNumber} attempts`);
        }
    }
};
const calculateNextRetry = (attemptNumber) => {
    const delayMs = BACKOFF_DELAYS[attemptNumber - 1];
    // No more retries after max attempts
    if (!delayMs)
        return null;
    return new Date(Date.now() + delayMs);
};
