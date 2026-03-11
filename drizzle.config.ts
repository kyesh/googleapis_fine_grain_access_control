import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.neon__POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
