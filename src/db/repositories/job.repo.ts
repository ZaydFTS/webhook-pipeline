import { db } from ".."
import { jobs } from "../schema/jobs"
import { desc, eq } from 'drizzle-orm'





export const jobRepo = {
    findById: async (id: string) => {
        const result = await db
            .select()
            .from(jobs)
            .where(eq(jobs.id, id))
            .limit(1)
        return result[0] ?? null
    },

    findByPipelineId: async (pipelineId: string) => {
        const result = await db
            .select()
            .from(jobs)
            .where(eq(jobs.pipelineId, pipelineId))
            .orderBy(desc(jobs.createdAt))
        return result
    },

    create: async (pipelineId: string, payload: Record<string, unknown>) => {
        const [job] = await db
            .insert(jobs)
            .values({ payload, pipelineId })
            .returning()
        return job
    },
    markCompleted: async (id: string, result: Record<string, unknown>) => {
        const [job] = await db
            .update(jobs)
            .set({ status: 'completed', result, completedAt: new Date() })
            .where(eq(jobs.id, id))
            .returning()
        return job
    },
    markFailed: async (id: string, error: string) => {
        const [job] = await db
            .update(jobs)
            .set({
                status: 'failed',
                error,
                completedAt: new Date(),
            })
            .where(eq(jobs.id, id))
            .returning()
        return job;
    },
}