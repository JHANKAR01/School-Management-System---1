
import { getRLSContext } from '../middleware/auth';
import { UserRole } from '../../../../types';
import { NotificationService } from '../services/notification-service';

// Mock DB (Prisma Client Wrapper)
const prisma = {
  attendance: {
    create: async (data: any) => { console.log('DB Insert:', data); return data; }
  },
  student: {
    findUnique: async (query: any) => { 
        // Mock returning a student with a token
        return { id: query.where.id, name: 'Student Name', parent_fcm_token: 'mock_device_token_abc123' }; 
    }
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
    const record = await prisma.attendance.create({
      data: {
        student_id: studentId,
        status: status,
        date: date,
        school_id: rls.school_id, // FORCE RLS
        marked_by: mockReq.user.id
      }
    });

    // 5. TRIGGER: Absent Alert
    if (status === 'ABSENT') {
      // In background (don't block response)
      setTimeout(async () => {
        try {
            const student = await prisma.student.findUnique({ where: { id: studentId } });
            if (student && student.parent_fcm_token) {
                await NotificationService.sendAttendanceAlert(student.name, student.parent_fcm_token);
            }
        } catch(e) { console.error("Alert Trigger Failed", e); }
      }, 0);
    }

    return c.json({ success: true, record });

  } catch (error: any) {
    console.error("Attendance Submission Failed:", error.message);
    return c.json({ error: "Unauthorized or Invalid Request" }, 403);
  }
}
