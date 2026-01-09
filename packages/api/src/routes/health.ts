
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';
import { SOVEREIGN_GENESIS_DATA } from '../data/dummy-data';

const healthRouter = new Hono();
healthRouter.use('*', authMiddleware);

healthRouter.post('/log', requireRole([UserRole.NURSE]), async (c) => {
  // ... existing log logic ...
  return c.json({ success: true });
});

healthRouter.get('/logs', requireRole([UserRole.NURSE, UserRole.PRINCIPAL]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.medicalLogs);
});

healthRouter.get('/counselor/notes', requireRole([UserRole.COUNSELOR, UserRole.PRINCIPAL]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.counseling);
});

export { healthRouter };
