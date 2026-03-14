import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: [
    './src/db/schema/pipelines.ts',
    './src/db/schema/jobs.ts',
    './src/db/schema/deliveries.ts',
    './src/db/schema/users.ts',
  ],
  out:     './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});