
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const logisticsRouter = new Hono();
logisticsRouter.use('*', authMiddleware);

// --- LIBRARY ---
logisticsRouter.get('/books', requireRole([UserRole.LIBRARIAN, UserRole.PRINCIPAL, UserRole.TEACHER]), async (c) => {
  return c.json([
    { id: 'BK-001', title: 'Concepts of Physics', author: 'H.C. Verma', isbn: '9788177091878', status: 'AVAILABLE' },
    { id: 'BK-002', title: 'Mathematics Class X', author: 'R.D. Sharma', isbn: '9788177091879', status: 'ISSUED', issuedTo: 'Rohan Gupta' },
    { id: 'BK-003', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '9788173711466', status: 'AVAILABLE' },
    { id: 'BK-004', title: 'Chemistry Part 1', author: 'NCERT', isbn: '9788173711467', status: 'AVAILABLE' },
    { id: 'BK-005', title: 'Oxford Atlas', author: 'Oxford', isbn: '9780190123456', status: 'ISSUED', issuedTo: 'Priya Singh' },
  ]);
});

logisticsRouter.post('/return-book', requireRole([UserRole.LIBRARIAN]), async (c) => {
  // ... existing return logic ...
  return c.json({ success: true, fine: 0 });
});

// --- FLEET ---
logisticsRouter.get('/buses', requireRole([UserRole.FLEET_MANAGER, UserRole.PRINCIPAL]), async (c) => {
  return c.json([
    { id: 'BUS-1A', number: 'DL-1PC-2023', route: 'Rohini Sec 13', capacity: 40, occupied: 38, status: 'ON_ROUTE', driver: 'Ramesh Kumar' },
    { id: 'BUS-4B', number: 'DL-1PC-9988', route: 'Dwarka Mor', capacity: 35, occupied: 30, status: 'IDLE', driver: 'Suresh Singh' },
    { id: 'BUS-7C', number: 'DL-1PC-5544', route: 'Pitampura', capacity: 50, occupied: 48, status: 'MAINTENANCE', driver: 'Vijay Yadav' },
  ]);
});

logisticsRouter.post('/assign-route', requireRole([UserRole.FLEET_MANAGER]), async (c) => {
  return c.json({ success: true, message: "Route Assigned" });
});

// --- HOSTEL ---
logisticsRouter.get('/rooms', requireRole([UserRole.WARDEN, UserRole.PRINCIPAL]), async (c) => {
  return c.json([
    { id: 'R-101', number: '101', block: 'Cauvery (Boys)', capacity: 4, occupied: 3, fee: 8000 },
    { id: 'R-102', number: '102', block: 'Cauvery (Boys)', capacity: 4, occupied: 4, fee: 8000 },
    { id: 'R-205', number: '205', block: 'Ganga (Girls)', capacity: 3, occupied: 1, fee: 9500 },
    { id: 'R-206', number: '206', block: 'Ganga (Girls)', capacity: 3, occupied: 0, fee: 9500 },
  ]);
});

logisticsRouter.post('/allocate-room', requireRole([UserRole.WARDEN]), async (c) => {
  return c.json({ success: true });
});

export { logisticsRouter };
