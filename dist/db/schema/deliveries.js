"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryAttempts = exports.deliveryStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const jobs_1 = require("./jobs");
const pipelines_1 = require("./pipelines");
exports.deliveryStatusEnum = (0, pg_core_1.pgEnum)('delivery_status', [
    'pending',
    'success',
    'failed',
]);
exports.deliveryAttempts = (0, pg_core_1.pgTable)('delivery_attempts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    jobId: (0, pg_core_1.uuid)('job_id').notNull().references(() => jobs_1.jobs.id, { onDelete: 'cascade' }),
    subscriberId: (0, pg_core_1.uuid)('subscriber_id').notNull().references(() => pipelines_1.subscribers.id, { onDelete: 'cascade' }),
    status: (0, exports.deliveryStatusEnum)('status').notNull().default('pending'),
    statusCode: (0, pg_core_1.integer)('status_code'),
    responseBody: (0, pg_core_1.text)('response_body'),
    error: (0, pg_core_1.text)('error'),
    attemptNumber: (0, pg_core_1.integer)('attempt_number').notNull().default(1),
    nextRetryAt: (0, pg_core_1.timestamp)('next_retry_at', { withTimezone: true }),
    deliveryAt: (0, pg_core_1.timestamp)('delivery_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
