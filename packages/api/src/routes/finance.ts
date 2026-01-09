import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';
import { fuzzyMatch, calculateSiblingDiscount } from '../utils/finance-utils';

type Variables = {
  user: {
    id: string;
    role: UserRole;
    school_id: string;
  };
};

const financeRouter = new Hono<{ Variables: Variables }>();
financeRouter.use('*', authMiddleware);
financeRouter.use('*', requireRole([UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT, UserRole.FINANCE_MANAGER]));

financeRouter.post('/reconcile', async (c) => {
  const { transactions } = await c.req.json(); 
  const pendingInvoices = [
    { id: 'INV-101', amount: 5000, utr: 'UPI123456', description: 'Rahul Fee' },
    { id: 'INV-102', amount: 2500, utr: 'NEFT98765', description: 'Priya Bus' }
  ];

  const results = transactions.map((txn: any) => {
    // 1. Exact Match
    const exact = pendingInvoices.find(inv => inv.utr === txn.refNo && inv.amount === txn.amount);
    if (exact) return { ...txn, status: 'MATCHED', invoiceId: exact.id };

    // 2. Fuzzy Match on Description using Utility
    const bestMatch = pendingInvoices.find(inv => {
      const dist = fuzzyMatch(inv.description.toLowerCase(), txn.description.toLowerCase());
      return dist <= 5 && inv.amount === txn.amount;
    });

    if (bestMatch) return { ...txn, status: 'FUZZY_MATCH', invoiceId: bestMatch.id, confidence: 'High' };

    return { ...txn, status: 'UNMATCHED' };
  });

  return c.json({ results });
});

financeRouter.post('/generate-fee', async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { studentId, baseAmount } = await c.req.json();
  
  // Use robust sibling utility
  const discountData = await calculateSiblingDiscount(studentId, baseAmount, db);
  
  const finalAmount = baseAmount - discountData.amount;

  return c.json({
    studentId,
    baseAmount,
    discount: discountData.amount,
    discountReason: discountData.applied ? 'SIBLING_DISCOUNT' : null,
    finalAmount
  });
});

export { financeRouter };