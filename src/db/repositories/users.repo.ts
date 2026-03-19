
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema/users';


export const userRepo = {
    create: async (email: string, hashedPassword: string) => {
        const [user] = await db
            .insert(users)
            .values({ email, password: hashedPassword })
            .returning();
        return user;
    },
    findByEmail: async (email: string) => {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return result[0] ?? null;
    },
    findById: async (id: string) => {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
        return result[0] ?? null;
    }
}   