import { Job } from "../../types/job.types"
import { db } from ".."
import { jobs } from "../schema/jobs"
import { desc, eq, sql } from 'drizzle-orm'





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
    claimNextJob: async (): Promise<Job | null> => {
        const result = await db.execute(sql`
      UPDATE jobs
      SET
        status     = 'processing',
        started_at = NOW(),
        attempts   = attempts + 1
      WHERE id = (
        SELECT id FROM jobs
        WHERE  status = 'pending'
        ORDER  BY created_at ASC
        LIMIT  1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
    `);

        if (result.rows.length === 0) return null;

        // Map snake_case DB columns → camelCase Job type
        const row = result.rows[0] as Record<string, unknown>;
        return {
            id: row.id,
            pipelineId: row.pipeline_id,
            status: row.status,
            payload: row.payload,
            result: row.result ?? null,
            error: row.error ?? null,
            attempts: row.attempts,
            maxAttempts: row.max_attempts,
            startedAt: row.started_at ? new Date(row.started_at as string) : null,
            completedAt: row.completed_at ? new Date(row.completed_at as string) : null,
            createdAt: new Date(row.created_at as string),
        } as Job;
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