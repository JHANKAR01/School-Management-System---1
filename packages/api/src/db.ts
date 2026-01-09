import { PrismaClient } from '@prisma/client';

/**
 * Sovereign DB Factory
 * Wraps the standard Prisma Client to enforce Row-Level Security (RLS).
 * 
 * CONCEPT:
 * PostgreSQL RLS works by checking a session variable.
 * We hijack every transaction to set 'app.current_school_id' before execution.
 */

const globalPrisma = new PrismaClient();

export type SovereignDB = ReturnType<typeof getTenantDB>;

export const getTenantDB = (schoolId: string, role: string) => {
  return globalPrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          // 1. Enforce School ID logic
          // For Super Admins, we might bypass this, but for now we enforce strict isolation.
          
          const [, result] = await globalPrisma.$transaction([
            // Set the RLS variable in Postgres for this transaction block
            globalPrisma.$executeRaw`SELECT set_config('app.current_school_id', ${schoolId}, TRUE)`,
            query(args),
          ]);
          return result;
        },
      },
    },
  });
};

/*
  --- SQL FOR RLS POLICY (Run this in Supabase/Postgres) ---
  
  ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "isolate_students_by_school" ON "Student"
  USING (school_id = current_setting('app.current_school_id')::text);

  -- Repeat for all tables with school_id
*/
