
import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';
import { SOVEREIGN_GENESIS_DATA } from '../data/dummy-data';

const operationsRouter = new Hono();
operationsRouter.use('*', authMiddleware);

// --- SECURITY HEAD: Gate Logs ---
operationsRouter.get('/gate-logs', requireRole([UserRole.SECURITY_HEAD, UserRole.PRINCIPAL]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.gateLogs);
});

operationsRouter.post('/broadcast-alert', requireRole([UserRole.SECURITY_HEAD]), async (c) => {
  const { type, message } = await c.req.json();
  console.log(`[EMERGENCY] ${type}: ${message}`);
  // In prod: Trigger FCM to all apps
  return c.json({ success: true, timestamp: new Date().toISOString() });
});

// --- ESTATE MANAGER: Maintenance Tickets ---
operationsRouter.get('/tickets', requireRole([UserRole.ESTATE_MANAGER, UserRole.PRINCIPAL]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.tickets);
});

operationsRouter.post('/tickets/resolve', requireRole([UserRole.ESTATE_MANAGER]), async (c) => {
  const { id } = await c.req.json();
  return c.json({ success: true, id, status: 'RESOLVED' });
});

// --- RECEPTIONIST: Visitor Management ---
operationsRouter.get('/visitors', requireRole([UserRole.RECEPTIONIST]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.visitors);
});

operationsRouter.post('/visitors', requireRole([UserRole.RECEPTIONIST]), async (c) => {
  const body = await c.req.json();
  return c.json({ ...body, id: Date.now(), status: 'WAITING' });
});

export { operationsRouter };
