
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const healthRouter = new Hono();
healthRouter.use('*', authMiddleware);

healthRouter.post('/log', requireRole([UserRole.NURSE]), async (c) => {
  // ... existing log logic ...
  return c.json({ success: true });
});

healthRouter.get('/counselor/notes', requireRole([UserRole.COUNSELOR, UserRole.PRINCIPAL]), async (c) => {
  return c.json([
    { id: 1, student: 'Amit Verma (9-C)', category: 'Behavioral', note: 'Showing signs of withdrawal. Recommended art therapy.', date: '2023-10-24' },
    { id: 2, student: 'Neha Kapoor (10-A)', category: 'Academic Stress', note: 'Anxious about boards. Exam fear session conducted.', date: '2023-10-25' },
    { id: 3, student: 'Rahul Singh (8-B)', category: 'Disruptive', note: 'Aggressive in playground. Parent meeting scheduled.', date: '2023-10-26' },
  ]);
});

export { healthRouter };
