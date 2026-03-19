"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const users_1 = require("../../db/schema/users");
exports.userRepo = {
    create: async (email, hashedPassword) => {
        const [user] = await db_1.db
            .insert(users_1.users)
            .values({ email, password: hashedPassword })
            .returning();
        return user;
    },
    findByEmail: async (email) => {
        const result = await db_1.db
            .select()
            .from(users_1.users)
            .where((0, drizzle_orm_1.eq)(users_1.users.email, email))
            .limit(1);
        return result[0] ?? null;
    },
    findById: async (id) => {
        const result = await db_1.db
            .select()
            .from(users_1.users)
            .where((0, drizzle_orm_1.eq)(users_1.users.id, id))
            .limit(1);
        return result[0] ?? null;
    }
};
