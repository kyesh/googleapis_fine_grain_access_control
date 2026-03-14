import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const connectionString = process.env.neon__POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

if (!connectionString) {
  console.log('⚠️  No database connection string found. Skipping migration.');
  process.exit(0);
}

async function main() {
  console.log('🚀 Running database migrations...');

  const sql = neon(connectionString);
  const db = drizzle({ client: sql });

  await migrate(db, { migrationsFolder: './src/db/migrations' });

  console.log('✅ Migrations complete!');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
