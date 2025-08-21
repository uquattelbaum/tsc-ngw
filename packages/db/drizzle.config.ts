import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./packages/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! }
} satisfies Config;
