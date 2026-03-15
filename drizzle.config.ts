import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config({ path: ".env.local" });

const getGitBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
};

const gitBranch = getGitBranch();
const isMainBranch = gitBranch === 'main';

// Determine the URL to use. Fallbacks exist, but we will guard them heavily.
const dbUrl = process.env.neon__POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";

if (!isMainBranch && dbUrl.includes('.neon.tech')) {
  if (!process.env.neon__POSTGRES_URL) {
    console.error(`\n🚨 DRIZZLE SAFETY ABORT: You are on branch '${gitBranch}' but 'neon__POSTGRES_URL' is missing.`);
    console.error(`Continuing would cause Drizzle to silently fall back to the PRODUCTION environment variables.`);
    console.error(`Please run 'npm run db:branch' first to provision an isolated branch and update .env.local.\n`);
    process.exit(1);
  }
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
