import { pgTable, uuid, jsonb, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { pipelines } from './pipelines';


export const jobStatusEnum = pgEnum('job_status', [
    'pending',
    'processing',
    'completed',
    'failed',
]);


export const jobs = pgTable('jobs', {
    id: uuid('id').primaryKey().defaultRandom(),
    pipelineId: uuid('pipeline_id').notNull().references(() => pipelines.id, { onDelete: 'cascade' }),
    status: jobStatusEnum('status').notNull().default('pending'),
    payload: jsonb('payload').notNull(),
    result: jsonb('result'),
    error: text('error'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(3),
    startedAt : timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

