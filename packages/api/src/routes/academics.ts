
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';
import { generatePDFMarksheet } from '../services/pdf-service';
import { SOVEREIGN_GENESIS_DATA } from '../data/dummy-data';

type Variables = {
  user: {
    id: string;
    role: UserRole;
    school_id: string;
  };
};

const academicsRouter = new Hono<{ Variables: Variables }>();
academicsRouter.use('*', authMiddleware);

// --- TEACHER: Marks Entry ---
academicsRouter.post('/results', requireRole([UserRole.TEACHER, UserRole.PRINCIPAL]), async (c) => {
  const user = c.get('user');
  const { examId, studentId, marks } = await c.req.json();
  // Simulate DB Upsert
  return c.json({ success: true, examId, studentId, marks });
});

// --- EXAM CELL: Question Paper Inventory ---
academicsRouter.get('/papers', requireRole([UserRole.EXAM_CELL, UserRole.PRINCIPAL]), async (c) => {
  return c.json([
    { id: 'QP-1', subject: 'Mathematics', class: 'X', copies: 150, status: 'PRINTED', location: 'Strong Room A' },
    { id: 'QP-2', subject: 'Physics', class: 'XII', copies: 80, status: 'PENDING', location: '-' },
  ]);
});

// --- HOD: Syllabus Tracking ---
academicsRouter.get('/syllabus', requireRole([UserRole.HOD, UserRole.PRINCIPAL]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.syllabus);
});

// --- HOMEWORK ---
academicsRouter.get('/homework', requireRole([UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.STUDENT, UserRole.PARENT]), async (c) => {
  return c.json(SOVEREIGN_GENESIS_DATA.homework);
});

// --- VICE PRINCIPAL: Timetables & Substitution ---
academicsRouter.get('/substitutions', requireRole([UserRole.VICE_PRINCIPAL]), async (c) => {
  return c.json([
    { id: 1, absentTeacher: 'Mrs. R. Iyer', period: 3, class: 'VIII-B', subject: 'History', assignedTo: 'Mr. T. Das (Free)' },
    { id: 2, absentTeacher: 'Mr. P. Singh', period: 5, class: 'X-A', subject: 'PT', assignedTo: 'Library' },
  ]);
});

// --- PDF GENERATION ---
academicsRouter.post('/generate-report', async (c) => {
  const { studentId, examId } = await c.req.json();
  const pdfUrl = await generatePDFMarksheet(studentId, examId);
  return c.json({ url: pdfUrl });
});

export { academicsRouter };
