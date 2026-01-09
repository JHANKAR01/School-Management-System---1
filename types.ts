export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  ACCOUNTANT = 'ACCOUNTANT',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT'
}

export interface SchoolConfig {
  school_id: string;
  name: string;
  logo_url: string;
  primary_color: string;
  features: {
    attendance: boolean;
    fees: boolean;
    transport: boolean;
  };
  location: {
    lat: number;
    lng: number;
  };
  upi_vpa: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  synced: boolean;
}

// --- ACADEMICS ---
export interface ExamComponent {
  id: string;
  name: string; // e.g., "Unit Test 1"
  maxMarks: number;
  weightage: number; // Percentage (0-100)
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  marks: Record<string, number>; // examComponentId -> marksObtained
}

// --- FINANCE ---
export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'VERIFIED' | 'PAID';
  utr?: string; // User submitted UTR
}

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'CR' | 'DR';
  refNo: string; // Extracted UTR from bank statement
}

// --- HR & PAYROLL ---
export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  basicSalary: number;
  allowances: number;
  pfEnabled: boolean;
  esiEnabled: boolean;
}

export interface SalarySlip {
  employeeId: string;
  month: string;
  totalDays: number;
  workingDays: number;
  leaveDays: number; // LOP
  basicPay: number;
  allowances: number;
  deductions: {
    pf: number;
    esi: number;
    lop: number; // Loss of Pay
    tax: number;
  };
  netSalary: number;
}

// --- TRANSPORT ---
export interface BusLocation {
  busId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: number;
}
