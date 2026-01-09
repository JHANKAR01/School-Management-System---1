
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const admissionsRouter = new Hono();
admissionsRouter.use('*', authMiddleware);

admissionsRouter.get('/', requireRole([UserRole.ADMISSIONS_OFFICER]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  
  const inquiries = await db.inquiry.findMany({
    orderBy: { created_at: 'desc' }
  });
  
  return c.json(inquiries);
});

admissionsRouter.post('/', requireRole([UserRole.ADMISSIONS_OFFICER]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const data = await c.req.json();
  
  const inquiry = await db.inquiry.create({
    data: {
      school_id: user.school_id,
      parent_name: data.parentName,
      phone: data.phone,
      target_class: data.class,
      status: 'NEW'
    }
  });
  
  return c.json(inquiry);
});

export { admissionsRouter };
