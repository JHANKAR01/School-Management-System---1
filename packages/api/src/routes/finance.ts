import { Hono } from 'hono';
import Papa from 'papaparse';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const financeRouter = new Hono();

// Apply Auth & RBAC (Accountants & Admins Only)
financeRouter.use('*', authMiddleware);
financeRouter.use('*', requireRole([UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT]));

/**
 * POST /api/finance/reconcile
 * Upload Bank Statement CSV -> Match UTRs -> Update Invoices
 */
financeRouter.post('/reconcile', async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  
  const body = await c.req.parseBody();
  const file = body['csv_file'];

  if (!(file instanceof File)) {
    return c.json({ error: "Invalid file upload" }, 400);
  }

  const csvText = await file.text();
  const results: any[] = [];
  const errors: any[] = [];

  // 1. Parse CSV
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    step: async (row, parser) => {
      // Pause parsing to handle DB async ops
      parser.pause();
      
      const data: any = row.data;
      // Heuristic to find UTR (Ref No) and Credit Amount
      const utr = data['Ref No'] || data['Reference'] || data['Description']; // Simplified extraction
      const credit = parseFloat(data['Credit'] || data['Amount'] || '0');

      if (credit > 0 && utr) {
        try {
          // 2. Atomic Match & Update
          // RLS ensures we only match invoices for THIS school
          const matched = await db.invoice.updateMany({
            where: {
              utr: { contains: utr }, // Fuzzy match
              amount: credit,
              status: 'PENDING'
            },
            data: {
              status: 'PAID'
            }
          });

          if (matched.count > 0) {
            results.push({ utr, status: 'MATCHED', amount: credit });
          } else {
            // Log unmatched for manual review
            await db.bankTransaction.create({
              data: {
                school_id: user.school_id,
                date: new Date(),
                description: JSON.stringify(data),
                amount: credit,
                type: 'CR',
                ref_no: utr
              }
            });
            results.push({ utr, status: 'UNMATCHED', amount: credit });
          }
        } catch (e) {
          errors.push({ row: data, error: e });
        }
      }
      
      parser.resume();
    },
    complete: () => {
      console.log(`[Finance] Reconciliation Complete for School ${user.school_id}`);
    }
  });

  return c.json({ 
    message: "Reconciliation Processed", 
    summary: { processed: results.length, errors: errors.length } 
  });
});

export { financeRouter };
