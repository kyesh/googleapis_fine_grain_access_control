import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const sql = neon(process.env.neon__POSTGRES_URL || process.env.POSTGRES_URL);
const db = drizzle(sql);
migrate(db, { migrationsFolder: './src/db/migrations' }).then(() => {
  console.log('Migration complete');
  process.exit(0);
});
