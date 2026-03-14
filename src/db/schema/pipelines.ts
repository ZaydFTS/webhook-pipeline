

import { jsonb, pgEnum, timestamp, pgTable, uuid, varchar, boolean, text } from "drizzle-orm/pg-core";




export const actionTypeEnum = pgEnum("action_type", [
    'filter_data',
    'transform_format',
    'validate_data',
]);


export const pipelines = pgTable('pipelines', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    description: text('description'),
    sourceUrl: varchar('source_url', { length: 255 }).notNull().unique(),
    actionType: actionTypeEnum('action_type').notNull(),
    actionConfig: jsonb('action_config').notNull().default({}),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});


export const subscribers = pgTable('subscribers', {
    id: uuid('id').primaryKey().defaultRandom(),
    pipelineId: uuid('pipeline_id').notNull().references(() => pipelines.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});