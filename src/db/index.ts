

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config';
import * as schema from './schema/pipelines';
import * as jobSchema from './schema/jobs';
import * as deliverySchema from './schema/deliveries';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle(pool, {
  schema: { ...schema, ...jobSchema, ...deliverySchema },
});