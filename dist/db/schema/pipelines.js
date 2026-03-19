"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribers = exports.pipelines = exports.actionTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.actionTypeEnum = (0, pg_core_1.pgEnum)("action_type", [
    'filter_data',
    'transform_format',
    'http_enrich',
]);
exports.pipelines = (0, pg_core_1.pgTable)('pipelines', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    sourceUrl: (0, pg_core_1.varchar)('source_url', { length: 255 }).notNull().unique(),
    actionType: (0, exports.actionTypeEnum)('action_type').notNull(),
    actionConfig: (0, pg_core_1.jsonb)('action_config').notNull().default({}),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
exports.subscribers = (0, pg_core_1.pgTable)('subscribers', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    pipelineId: (0, pg_core_1.uuid)('pipeline_id').notNull().references(() => exports.pipelines.id, { onDelete: 'cascade' }),
    url: (0, pg_core_1.text)('url').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
});
