import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { deliveryAttempts } from '@/db/schema/deliveries';




export const delivertRepo = {

    findByJobId: async (jobId: string) => {
        return await db
            .select()
            .from(deliveryAttempts)
            .where(eq(deliveryAttempts.jobId, jobId))
    },
    create: async (data: {
        jobId: string,
        subscriberId: string,
        attemptNumber: number,
    }) => {
        const [attempt] = await db
            .insert(deliveryAttempts)
            .values(data)
            .returning()
        return attempt

    },
    markSuccess: async (
        id: string,
        statusCode: number,
        responseBody: string,
    ) => {
        const [attept] = await db
            .update(deliveryAttempts)
            .set({
                status: 'success',
                statusCode,
                responseBody,
                deliveryAt: new Date(),
            })
            .where(eq(deliveryAttempts.id, id))
            .returning()
        return attept
    },
    markFailed: async (id: string,
        error: string,
        nextRetryAt: Date,
    ) => {
        const [attept] = await db
            .update(deliveryAttempts)
            .set({
                status: 'failed',
                error,
                nextRetryAt,
            })
            .where(eq(deliveryAttempts.id, id))
            .returning()
        return attept
    }
}