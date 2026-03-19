"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineRepo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const index_1 = require("../index");
const pipelines_1 = require("../schema/pipelines");
const uuid_1 = require("uuid");
exports.pipelineRepo = {
    findAll: async () => {
        return await index_1.db.select().from(pipelines_1.pipelines);
    },
    findById: async (id) => {
        const result = await index_1.db
            .select()
            .from(pipelines_1.pipelines)
            .where((0, drizzle_orm_1.eq)(pipelines_1.pipelines.id, id))
            .limit(1);
        return result[0] ?? null;
    },
    findBySourceUrl: async (url) => {
        const result = await index_1.db
            .select()
            .from(pipelines_1.pipelines)
            .where((0, drizzle_orm_1.eq)(pipelines_1.pipelines.sourceUrl, url))
            .limit(1);
        return result[0] ?? null;
    },
    create: async (dto) => {
        const sourceUrl = `/webhook/${(0, uuid_1.v4)()}`;
        const [pipeline] = await index_1.db
            .insert(pipelines_1.pipelines)
            .values({
            name: dto.name,
            description: dto.description ?? null,
            sourceUrl,
            actionType: dto.actionType,
            actionConfig: dto.actionConfig ?? {},
            isActive: true,
        })
            .returning();
        if (dto.subscriberUrls && dto.subscriberUrls.length > 0) {
            await index_1.db.insert(pipelines_1.subscribers).values(dto.subscriberUrls.map(url => ({
                pipelineId: pipeline.id,
                url,
                isActive: true,
            })));
        }
        return pipeline;
    },
    update: async (id, data) => {
        const [updated] = await index_1.db
            .update(pipelines_1.pipelines)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(pipelines_1.pipelines.id, id))
            .returning();
        return updated ?? null;
    },
    delete: async (id) => {
        const deleted = await index_1.db
            .delete(pipelines_1.pipelines)
            .where((0, drizzle_orm_1.eq)(pipelines_1.pipelines.id, id))
            .returning();
        return deleted[0] ?? null;
    },
    findSubscribers: async (pipelineId) => {
        const result = await index_1.db
            .select()
            .from(pipelines_1.subscribers)
            .where((0, drizzle_orm_1.eq)(pipelines_1.subscribers.pipelineId, pipelineId));
        return result;
    }
};
