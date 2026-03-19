

import crypto from 'crypto';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { refreshTokens } from '../schema/users';




export const refreshTokenRepo = {

    create: async (userId: string, expiresAt: Date,) => {
        const token = crypto.randomBytes(64).toString('hex');
        const [refreshToken] = await db
            .insert(refreshTokens)
            .values({
                userId,
                token,
                expiresAt,
            })
            .returning();
        return refreshToken;
    },
    findByToken: async (token: string) => {
        const result = await db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.token, token))
            .limit(1)
        return result[0];
    },
    deleteByToken: async (token: string) => {
        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.token, token));
    },
    deleteAllForUser: async (userId: string) => {
        await db.delete(refreshTokens)
            .where(eq(refreshTokens.userId, userId));
    },
}