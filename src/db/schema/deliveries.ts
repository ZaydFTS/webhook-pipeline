import { pgTable, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { jobs } from './jobs';
import { subscribers } from './pipelines';




export const deliveryStatusEnum = pgEnum('delivery_status', [
    'pending',
    'success',
    'failed',
]);


export const deliveryAttempts = pgTable('delivery_attempts', {
    id: uuid('id').primaryKey().defaultRandom(),
    jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
    subscriberId: uuid('subscriber_id').notNull().references(() => subscribers.id, { onDelete: 'cascade' }),
    status: deliveryStatusEnum('status').notNull().default('pending'),
    statusCode: integer('status_code'),
    responseBody: text('response_body'),
    error: text('error'),
    attemptNumber: integer('attempt_number').notNull().default(1),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
    deliveryAt: timestamp('delivery_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

