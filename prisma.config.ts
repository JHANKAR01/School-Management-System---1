import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Ensure DATABASE_URL is present


export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});