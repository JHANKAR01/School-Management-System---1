import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use your Supabase connection string from .env
    url: env("DATABASE_URL"),
  },
});