"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = exports.jobStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pipelines_1 = require("./pipelines");
exports.jobStatusEnum = (0, pg_core_1.pgEnum)('job_status', [
    'pending',
    'processing',
    'completed',
    'failed',
]);
exports.jobs = (0, pg_core_1.pgTable)('jobs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    pipelineId: (0, pg_core_1.uuid)('pipeline_id').notNull().references(() => pipelines_1.pipelines.id, { onDelete: 'cascade' }),
    status: (0, exports.jobStatusEnum)('status').notNull().default('pending'),
    payload: (0, pg_core_1.jsonb)('payload').notNull(),
    result: (0, pg_core_1.jsonb)('result'),
    error: (0, pg_core_1.text)('error'),
    attempts: (0, pg_core_1.integer)('attempts').notNull().default(0),
    maxAttempts: (0, pg_core_1.integer)('max_attempts').notNull().default(3),
    startedAt: (0, pg_core_1.timestamp)('started_at', { withTimezone: true }),
    completedAt: (0, pg_core_1.timestamp)('completed_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
