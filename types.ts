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
