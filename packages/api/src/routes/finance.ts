
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const financeRouter = new Hono();
financeRouter.use('*', authMiddleware);
financeRouter.use('*', requireRole([UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT, UserRole.FINANCE_MANAGER]));

// Levenshtein Distance for Fuzzy Matching
const levenshteinDistance = (a: string, b: string) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

financeRouter.post('/reconcile', async (c) => {
  const { transactions } = await c.req.json(); // Array of bank rows
  const pendingInvoices = [
    { id: 'INV-101', amount: 5000, utr: 'UPI123456', description: 'Rahul Fee' },
    { id: 'INV-102', amount: 2500, utr: 'NEFT98765', description: 'Priya Bus' }
  ];

  const results = transactions.map((txn: any) => {
    // 1. Exact Match
    const exact = pendingInvoices.find(inv => inv.utr === txn.refNo && inv.amount === txn.amount);
    if (exact) return { ...txn, status: 'MATCHED', invoiceId: exact.id };

    // 2. Fuzzy Match on Description
    const bestMatch = pendingInvoices.find(inv => {
      const dist = levenshteinDistance(inv.description.toLowerCase(), txn.description.toLowerCase());
      return dist <= 5 && inv.amount === txn.amount; // Allow 5 char typos
    });

    if (bestMatch) return { ...txn, status: 'FUZZY_MATCH', invoiceId: bestMatch.id, confidence: 'High' };

    return { ...txn, status: 'UNMATCHED' };
  });

  return c.json({ results });
});

// Auto-Discount Engine
financeRouter.post('/generate-fee', async (c) => {
  const { studentId, baseAmount } = await c.req.json();
  
  // Mock Sibling Check
  const hasSibling = studentId === 'ST-2'; // Demo logic
  const discount = hasSibling ? baseAmount * 0.10 : 0; // 10% Sibling Discount
  
  const finalAmount = baseAmount - discount;

  return c.json({
    studentId,
    baseAmount,
    discount,
    discountReason: hasSibling ? 'SIBLING_DISCOUNT' : null,
    finalAmount
  });
});

export { financeRouter };
