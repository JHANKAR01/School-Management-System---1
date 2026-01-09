
import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const operationsRouter = new Hono();
operationsRouter.use('*', authMiddleware);

// --- SECURITY HEAD: Gate Logs ---
operationsRouter.get('/gate-logs', requireRole([UserRole.SECURITY_HEAD, UserRole.PRINCIPAL]), async (c) => {
  // Mock DB fetch with Localized Data
  return c.json([
    { id: 1, type: 'VISITOR', name: 'Ramesh Courier', purpose: 'Amazon Delivery', time: '10:30 AM', status: 'EXITED' },
    { id: 2, type: 'PARENT', name: 'Mrs. Sharma', purpose: 'Fee Payment', time: '11:15 AM', status: 'INSIDE' },
    { id: 3, type: 'STAFF', name: 'S. Gupta', purpose: 'Late Entry', time: '08:45 AM', status: 'INSIDE' },
  ]);
});

operationsRouter.post('/broadcast-alert', requireRole([UserRole.SECURITY_HEAD]), async (c) => {
  const { type, message } = await c.req.json();
  console.log(`[EMERGENCY] ${type}: ${message}`);
  // In prod: Trigger FCM to all apps
  return c.json({ success: true, timestamp: new Date().toISOString() });
});

// --- ESTATE MANAGER: Maintenance Tickets ---
operationsRouter.get('/tickets', requireRole([UserRole.ESTATE_MANAGER, UserRole.PRINCIPAL]), async (c) => {
  return c.json([
    { id: 'T-101', location: 'Chemistry Lab', issue: 'Leaking Tap', priority: 'MEDIUM', status: 'OPEN', reportedBy: 'HOD Science' },
    { id: 'T-102', location: 'Class 5-B', issue: 'Broken Bench', priority: 'LOW', status: 'ASSIGNED', reportedBy: 'Class Teacher' },
    { id: 'T-103', location: 'Server Room', issue: 'AC Malfunction', priority: 'CRITICAL', status: 'PENDING', reportedBy: 'IT Admin' },
  ]);
});

operationsRouter.post('/tickets/resolve', requireRole([UserRole.ESTATE_MANAGER]), async (c) => {
  const { id } = await c.req.json();
  return c.json({ success: true, id, status: 'RESOLVED' });
});

// --- RECEPTIONIST: Visitor Management ---
operationsRouter.get('/visitors', requireRole([UserRole.RECEPTIONIST]), async (c) => {
  return c.json([
    { id: 1, name: 'Vikram Singh', student: 'Rohan (6-A)', purpose: 'Meeting Principal', time: '09:00 AM', status: 'WAITING' },
    { id: 2, name: 'Anita Desai', student: 'Priya (10-C)', purpose: 'Early Pickup', time: '12:30 PM', status: 'APPROVED' },
  ]);
});

operationsRouter.post('/visitors', requireRole([UserRole.RECEPTIONIST]), async (c) => {
  const body = await c.req.json();
  return c.json({ ...body, id: Date.now(), status: 'WAITING' });
});

export { operationsRouter };
