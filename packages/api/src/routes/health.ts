
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const healthRouter = new Hono();
healthRouter.use('*', authMiddleware);

healthRouter.post('/log', requireRole([UserRole.NURSE]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { studentId, issue, action } = await c.req.json();

  const log = await db.medicalLog.create({
    data: {
      school_id: user.school_id,
      student_id: studentId,
      issue,
      action_taken: action
    }
  });

  return c.json(log);
});

// For Teachers to check medical flags
healthRouter.get('/flags/:classId', requireRole([UserRole.TEACHER, UserRole.PRINCIPAL]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const classId = c.req.param('classId');

  const logs = await db.student.findMany({
    where: { class_id: classId },
    select: {
      id: true,
      full_name: true,
      medical_logs: {
        take: 1,
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  return c.json(logs);
});

export { healthRouter };
