
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole, getRLSContext } from '../middleware/auth';
import { UserRole } from '../../../../types';
import { AuditLogger } from '../utils/audit-logger';

type Variables = {
  user: {
    id: string;
    role: UserRole;
    school_id: string;
  };
};

const staffRouter = new Hono<{ Variables: Variables }>();

staffRouter.use('*', authMiddleware);
staffRouter.use('*', requireRole([UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN]));

// GET Staff List
staffRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  
  const staff = await db.user.findMany({
    where: { 
      role: { not: UserRole.STUDENT },
      is_active: true
    },
    include: { teacher_profile: true }
  });
  
  return c.json(staff);
});

// POST Create Staff
staffRouter.post('/', async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { name, role, department, username } = await c.req.json();

  // Create User Transactionally
  const newUser: any = await db.user.create({
    data: {
      school_id: user.school_id,
      full_name: name,
      username: username || `${name.toLowerCase().replace(/\s/g, '.')}`,
      password_hash: 'default_hash', // In prod, generate random temp pass
      role: role,
      teacher_profile: role === UserRole.TEACHER ? {
        create: { department: department || 'General' }
      } : undefined
    }
  });

  await AuditLogger.log(
    db,
    'CREATE_STAFF',
    user,
    `Created user ${newUser.username} as ${role}`,
    'USER',
    newUser.id,
    null,
    newUser
  );
  
  return c.json(newUser);
});

// DELETE Terminate Staff (Revoke Access)
staffRouter.delete('/:id', async (c) => {
  const user = c.get('user');
  const targetId = c.req.param('id');
  const db = getTenantDB(user.school_id, user.role);

  await db.user.update({
    where: { id: targetId },
    data: { is_active: false }
  });

  await AuditLogger.log(
    db,
    'TERMINATE_STAFF',
    user,
    `Revoked access for user ${targetId}`,
    'USER',
    targetId
  );
  return c.json({ success: true });
});

export { staffRouter };
