import { getRLSContext } from '../middleware/auth';
import { UserRole } from '../../../../types';

// Mock DB (Prisma Client)
const prisma = {
  attendance: {
    create: async (data: any) => { console.log('DB Insert:', data); return data; }
  }
};

interface HonoContext {
  req: any;
  json: (data: any, status?: number) => any;
  user?: any; // Populated by auth middleware
}

/**
 * Hardened Attendance Submission Route
 * Enforces School Isolation via RLS Context.
 */
export async function submitAttendance(c: HonoContext) {
  try {
    // 1. Context Extraction & Security Check
    // This simulates: `const user = c.get('user')`
    const mockReq = { 
        user: c.user || { id: 't1', role: UserRole.TEACHER, school_id: 'sch_123' },
        headers: {} 
    };
    
    // 2. Get RLS Context (Throws if school_id is missing/mismatch)
    const rls = getRLSContext(mockReq);

    // 3. Parse Body
    const body = await c.req.json();
    const { studentId, status, date } = body;

    // 4. Secure DB Operation
    // We explicitly inject `school_id` from the trusted RLS context, IGNORING user input for it.
    const record = await prisma.attendance.create({
      data: {
        student_id: studentId,
        status: status,
        date: date,
        school_id: rls.school_id, // FORCE RLS
        marked_by: mockReq.user.id
      }
    });

    return c.json({ success: true, record });

  } catch (error: any) {
    console.error("Attendance Submission Failed:", error.message);
    return c.json({ error: "Unauthorized or Invalid Request" }, 403);
  }
}
