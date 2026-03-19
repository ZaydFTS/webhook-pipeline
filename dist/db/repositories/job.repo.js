"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRepo = void 0;
const __1 = require("..");
const jobs_1 = require("../schema/jobs");
const drizzle_orm_1 = require("drizzle-orm");
exports.jobRepo = {
    findById: async (id) => {
        const result = await __1.db
            .select()
            .from(jobs_1.jobs)
            .where((0, drizzle_orm_1.eq)(jobs_1.jobs.id, id))
            .limit(1);
        return result[0] ?? null;
    },
    findByPipelineId: async (pipelineId) => {
        const result = await __1.db
            .select()
            .from(jobs_1.jobs)
            .where((0, drizzle_orm_1.eq)(jobs_1.jobs.pipelineId, pipelineId))
            .orderBy((0, drizzle_orm_1.desc)(jobs_1.jobs.createdAt));
        return result;
    },
    create: async (pipelineId, payload) => {
        const [job] = await __1.db
            .insert(jobs_1.jobs)
            .values({ payload, pipelineId })
            .returning();
        return job;
    },
    claimNextJob: async () => {
        const result = await __1.db.execute((0, drizzle_orm_1.sql) `
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
        if (result.rows.length === 0)
            return null;
        // Map snake_case DB columns → camelCase Job type
        const row = result.rows[0];
        return {
            id: row.id,
            pipelineId: row.pipeline_id,
            status: row.status,
            payload: row.payload,
            result: row.result ?? null,
            error: row.error ?? null,
            attempts: row.attempts,
            maxAttempts: row.max_attempts,
            startedAt: row.started_at ? new Date(row.started_at) : null,
            completedAt: row.completed_at ? new Date(row.completed_at) : null,
            createdAt: new Date(row.created_at),
        };
    },
    markCompleted: async (id, result) => {
        const [job] = await __1.db
            .update(jobs_1.jobs)
            .set({ status: 'completed', result, completedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(jobs_1.jobs.id, id))
            .returning();
        return job;
    },
    markFailed: async (id, error) => {
        const [job] = await __1.db
            .update(jobs_1.jobs)
            .set({
            status: 'failed',
            error,
            completedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(jobs_1.jobs.id, id))
            .returning();
        return job;
    },
};
