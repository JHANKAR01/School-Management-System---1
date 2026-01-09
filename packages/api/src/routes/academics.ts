
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const academicsRouter = new Hono();

academicsRouter.use('*', authMiddleware);

// TEACHER: Upsert Result (Enter Marks)
academicsRouter.post('/results', requireRole([UserRole.TEACHER, UserRole.PRINCIPAL]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { examId, studentId, marks } = await c.req.json();

  // Check if Exam is locked
  const exam = await db.exam.findUnique({ where: { id: examId } });
  if (exam?.is_locked) {
    return c.json({ error: "Exam is locked by Principal." }, 403);
  }

  const result = await db.result.upsert({
    where: {
      exam_id_student_id: { exam_id: examId, student_id: studentId }
    },
    update: { marks_obtained: marks },
    create: {
      school_id: user.school_id,
      exam_id: examId,
      student_id: studentId,
      marks_obtained: marks
    }
  });

  return c.json(result);
});

// PRINCIPAL: Lock Results
academicsRouter.post('/lock-exam', requireRole([UserRole.PRINCIPAL]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { examId } = await c.req.json();

  await db.exam.update({
    where: { id: examId },
    data: { is_locked: true }
  });

  return c.json({ success: true, message: "Exam Results Locked & Published" });
});

export { academicsRouter };
