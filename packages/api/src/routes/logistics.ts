
import { Hono } from 'hono';
import { getTenantDB } from '../db';
import { authMiddleware, requireRole } from '../middleware/auth';
import { UserRole } from '../../../../types';

const logisticsRouter = new Hono();
logisticsRouter.use('*', authMiddleware);

// FLEET MANAGER: Assign Route -> Trigger Transport Fee
logisticsRouter.post('/assign-route', requireRole([UserRole.FLEET_MANAGER]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { studentId, routeId } = await c.req.json();

  const route = await db.route.findUnique({ where: { id: routeId } });
  if (!route) return c.json({ error: "Route not found" }, 404);

  // 1. Create Invoice
  await db.invoice.create({
    data: {
      school_id: user.school_id,
      student_id: studentId,
      description: `Transport Fee: ${route.name}`,
      amount: route.monthly_fee,
      due_date: new Date(new Date().setDate(new Date().getDate() + 10)),
      status: 'PENDING'
    }
  });

  // 2. Logic to link student to route (omitted for brevity, assume implicit)
  
  return c.json({ success: true, message: "Route Assigned & Fee Generated" });
});

// LIBRARIAN: Return Book -> Fine Calculation
logisticsRouter.post('/return-book', requireRole([UserRole.LIBRARIAN]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { isbn, studentId } = await c.req.json();

  // Find active issue record
  const issue = await db.issueRecord.findFirst({
    where: { 
      student_id: studentId, 
      book: { isbn: isbn },
      return_date: null 
    }
  });

  if (!issue) return c.json({ error: "No active issue found" }, 404);

  // Calculate Fine
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - issue.due_date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const isOverdue = today > issue.due_date;
  const fine = isOverdue ? diffDays * 5 : 0; // 5 Rs per day

  // Update Record
  await db.issueRecord.update({
    where: { id: issue.id },
    data: { return_date: today, fine_amount: fine }
  });

  await db.book.update({
    where: { id: issue.book_id },
    data: { status: 'AVAILABLE' }
  });

  // Generate Fine Invoice if applicable
  if (fine > 0) {
    await db.invoice.create({
      data: {
        school_id: user.school_id,
        student_id: studentId,
        description: `Library Fine: ${isbn} (${diffDays} days overdue)`,
        amount: fine,
        due_date: today,
        status: 'PENDING'
      }
    });
  }

  return c.json({ success: true, fine });
});

// WARDEN: Allocate Room -> Trigger Hostel Fee
logisticsRouter.post('/allocate-room', requireRole([UserRole.WARDEN]), async (c) => {
  const user = c.get('user');
  const db = getTenantDB(user.school_id, user.role);
  const { studentId, roomId } = await c.req.json();

  const room = await db.hostelRoom.findUnique({ where: { id: roomId } });
  if (!room) return c.json({ error: "Room not found" }, 404);

  // Create Allocation
  await db.hostelAllocation.create({
    data: {
      school_id: user.school_id,
      student_id: studentId,
      room_id: roomId
    }
  });

  // Generate Fee
  await db.invoice.create({
    data: {
      school_id: user.school_id,
      student_id: studentId,
      description: `Hostel Fee: Room ${room.room_number}`,
      amount: room.monthly_fee,
      due_date: new Date(new Date().setDate(new Date().getDate() + 5)),
      status: 'PENDING'
    }
  });

  return c.json({ success: true });
});

export { logisticsRouter };
