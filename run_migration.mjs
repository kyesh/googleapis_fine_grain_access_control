import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.neon__POSTGRES_URL || process.env.POSTGRES_URL);

async function run() {
  try {
    await sql`ALTER TABLE "users" ADD COLUMN "proxy_key" text;`;
    await sql`ALTER TABLE "users" ADD CONSTRAINT "users_proxy_key_unique" UNIQUE("proxy_key");`;
    console.log('Migration successful');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Migration already applied or partial');
    } else {
      console.error(err);
    }
  }
}

run();
