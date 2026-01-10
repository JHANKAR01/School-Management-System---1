import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Ensure DATABASE_URL is present
const dbUrl = process.env.DATABASE_URL || env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});