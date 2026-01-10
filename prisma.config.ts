import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This pulls your Supabase connection string from the .env file
    url: env("DATABASE_URL"),
  },
});