


import { eq } from 'drizzle-orm';
import { db } from '../index';

import { pipelines, subscribers } from '../schema/pipelines';
import { CreatePipelineDto } from '../../types/pipeline.types';
import { uuidv4 } from 'zod';






export const pipelineRepo = {

    findAll: async () => {
        return await db.select().from(pipelines);
    },

    findById: async (id: string) => {
        const result = await db
            .select()
            .from(pipelines)
            .where(eq(pipelines.id, id))
            .limit(1);
        return result[0] ?? null;
    },

    findBySourceUrl: async (url: string) => {
        const result = await db
            .select()
            .from(pipelines)
            .where(eq(pipelines.sourceUrl, url))
            .limit(1);
        return result[0] ?? null;
    },

    create: async (dto: CreatePipelineDto) => {
        const sourceUrl = `/weebhook/${uuidv4()}`;
        const [pipeline] = await db
            .insert(pipelines)
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
            await db.insert(subscribers).values(
                dto.subscriberUrls.map(url => ({
                    pipelineId: pipeline.id,
                    url,
                    isActive: true,
                }))
            );
        }
        return pipeline;
    },

    update: async (id: string, data: Partial<CreatePipelineDto>) => {
        const [updated] = await db
            .update(pipelines)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(pipelines.id, id))
            .returning();
        return updated ?? null;
    },

    delete: async (id: string) => {
        const deleted = await db
            .delete(pipelines)
            .where(eq(pipelines.id, id))
            .returning();
        return deleted[0] ?? null;
    },

    findSubscribers: async (pipelineId: string) => {
        const result = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.pipelineId, pipelineId));
        return result;

    }
}
