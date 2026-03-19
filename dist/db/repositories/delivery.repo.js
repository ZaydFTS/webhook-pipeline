"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRepo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const deliveries_1 = require("../../db/schema/deliveries");
exports.deliveryRepo = {
    findByJobId: async (jobId) => {
        return await db_1.db
            .select()
            .from(deliveries_1.deliveryAttempts)
            .where((0, drizzle_orm_1.eq)(deliveries_1.deliveryAttempts.jobId, jobId));
    },
    create: async (data) => {
        const [attempt] = await db_1.db
            .insert(deliveries_1.deliveryAttempts)
            .values(data)
            .returning();
        return attempt;
    },
    markSuccess: async (id, statusCode, responseBody) => {
        const [attept] = await db_1.db
            .update(deliveries_1.deliveryAttempts)
            .set({
            status: 'success',
            statusCode,
            responseBody,
            deliveryAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(deliveries_1.deliveryAttempts.id, id))
            .returning();
        return attept;
    },
    markFailed: async (id, error, nextRetryAt) => {
        const [attept] = await db_1.db
            .update(deliveries_1.deliveryAttempts)
            .set({
            status: 'failed',
            error,
            nextRetryAt,
        })
            .where((0, drizzle_orm_1.eq)(deliveries_1.deliveryAttempts.id, id))
            .returning();
        return attept;
    },
    findPendingRetries: async () => {
        return await db_1.db
            .select()
            .from(deliveries_1.deliveryAttempts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(deliveries_1.deliveryAttempts.status, 'failed'), (0, drizzle_orm_1.lte)(deliveries_1.deliveryAttempts.nextRetryAt, new Date())));
    },
};
