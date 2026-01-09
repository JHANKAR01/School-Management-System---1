
import { UserRole, Book, Bus, HostelRoom, Invoice, BankTransaction, StudentResult } from '../../../../types';

// --- GENESIS CONSTANTS ---
const SCHOOL_ID_1 = 'sch_123'; // Sovereign High
const SCHOOL_ID_2 = 'sch_456'; // DAV Public

// --- 1. STUDENTS ---
export const DUMMY_STUDENTS = [
  { id: 'std_1', name: 'Aarav Kumar', class: '10-A', roll: 1, parent_phone: '9876543210', school_id: SCHOOL_ID_1 },
  { id: 'std_2', name: 'Diya Sharma', class: '10-A', roll: 2, parent_phone: '9876543211', school_id: SCHOOL_ID_1 },
  { id: 'std_3', name: 'Ishaan Patel', class: '10-A', roll: 3, parent_phone: '9876543212', school_id: SCHOOL_ID_1 },
  { id: 'std_4', name: 'Ananya Gupta', class: '10-B', roll: 1, parent_phone: '9876543213', school_id: SCHOOL_ID_1 },
  { id: 'std_5', name: 'Vihaan Singh', class: '10-B', roll: 2, parent_phone: '9876543214', school_id: SCHOOL_ID_1 },
  { id: 'std_6', name: 'Aditi Rao', class: '9-A', roll: 1, parent_phone: '9876543215', school_id: SCHOOL_ID_1 },
  { id: 'std_7', name: 'Kabir Das', class: '9-A', roll: 2, parent_phone: '9876543216', school_id: SCHOOL_ID_1 },
  { id: 'std_8', name: 'Meera Iyer', class: '9-B', roll: 1, parent_phone: '9876543217', school_id: SCHOOL_ID_1 },
  { id: 'std_9', name: 'Rohan Joshi', class: '8-A', roll: 1, parent_phone: '9876543218', school_id: SCHOOL_ID_1 },
  { id: 'std_10', name: 'Sanya Malhotra', class: '8-A', roll: 2, parent_phone: '9876543219', school_id: SCHOOL_ID_1 },
  { id: 'std_11', name: 'Arjun Reddy', class: '12-Sci', roll: 1, parent_phone: '9876543220', school_id: SCHOOL_ID_1 },
  { id: 'std_12', name: 'Priya Menon', class: '12-Sci', roll: 2, parent_phone: '9876543221', school_id: SCHOOL_ID_1 },
  { id: 'std_13', name: 'Karan Johar', class: '12-Com', roll: 1, parent_phone: '9876543222', school_id: SCHOOL_ID_1 },
  { id: 'std_14', name: 'Simran Kaur', class: '12-Com', roll: 2, parent_phone: '9876543223', school_id: SCHOOL_ID_1 },
  { id: 'std_15', name: 'Rahul Dravid', class: '11-Sci', roll: 1, parent_phone: '9876543224', school_id: SCHOOL_ID_1 },
  { id: 'std_16', name: 'Anjali Tendulkar', class: '11-Sci', roll: 2, parent_phone: '9876543225', school_id: SCHOOL_ID_1 },
  { id: 'std_17', name: 'Vikram Batra', class: '11-Arts', roll: 1, parent_phone: '9876543226', school_id: SCHOOL_ID_1 },
  { id: 'std_18', name: 'Neha Dhupia', class: '11-Arts', roll: 2, parent_phone: '9876543227', school_id: SCHOOL_ID_1 },
  { id: 'std_19', name: 'Siddharth Malhotra', class: '6-A', roll: 1, parent_phone: '9876543228', school_id: SCHOOL_ID_1 },
  { id: 'std_20', name: 'Kiara Advani', class: '6-A', roll: 2, parent_phone: '9876543229', school_id: SCHOOL_ID_1 },
];

// --- 2. STAFF ---
export const DUMMY_STAFF = [
  { id: 'stf_1', name: 'Mr. R.K. Narayan', role: UserRole.PRINCIPAL, department: 'Administration', school_id: SCHOOL_ID_1 },
  { id: 'stf_2', name: 'Mrs. Sudha Murthy', role: UserRole.VICE_PRINCIPAL, department: 'Academics', school_id: SCHOOL_ID_1 },
  { id: 'stf_3', name: 'Dr. A.P.J. Abdul', role: UserRole.HOD, department: 'Physics', school_id: SCHOOL_ID_1 },
  { id: 'stf_4', name: 'Mr. C.V. Raman', role: UserRole.TEACHER, department: 'Physics', school_id: SCHOOL_ID_1 },
  { id: 'stf_5', name: 'Mrs. Shakuntala Devi', role: UserRole.TEACHER, department: 'Mathematics', school_id: SCHOOL_ID_1 },
  { id: 'stf_6', name: 'Mr. Munshi Premchand', role: UserRole.TEACHER, department: 'Hindi', school_id: SCHOOL_ID_1 },
  { id: 'stf_7', name: 'Ms. Lata Mangeshkar', role: UserRole.TEACHER, department: 'Music', school_id: SCHOOL_ID_1 },
  { id: 'stf_8', name: 'Mr. Major Dhyan Chand', role: UserRole.TEACHER, department: 'Physical Education', school_id: SCHOOL_ID_1 },
  { id: 'stf_9', name: 'Mr. Harshad Mehta', role: UserRole.FINANCE_MANAGER, department: 'Accounts', school_id: SCHOOL_ID_1 },
  { id: 'stf_10', name: 'Ms. Florence Nightingale', role: UserRole.NURSE, department: 'Infirmary', school_id: SCHOOL_ID_1 },
  { id: 'stf_11', name: 'Dr. Freud', role: UserRole.COUNSELOR, department: 'Wellness', school_id: SCHOOL_ID_1 },
  { id: 'stf_12', name: 'Mr. Bond', role: UserRole.SECURITY_HEAD, department: 'Security', school_id: SCHOOL_ID_1 },
  { id: 'stf_13', name: 'Mr. Dewey', role: UserRole.LIBRARIAN, department: 'Library', school_id: SCHOOL_ID_1 },
  { id: 'stf_14', name: 'Mrs. Hudson', role: UserRole.WARDEN, department: 'Hostel', school_id: SCHOOL_ID_1 },
  { id: 'stf_15', name: 'Mr. Q', role: UserRole.IT_ADMIN, department: 'IT', school_id: SCHOOL_ID_1 },
];

// --- 3. BOOKS ---
export const DUMMY_BOOKS: Book[] = [
  { isbn: '978-01', title: 'Concepts of Physics Vol 1', author: 'H.C. Verma', status: 'AVAILABLE' },
  { isbn: '978-02', title: 'Concepts of Physics Vol 2', author: 'H.C. Verma', status: 'ISSUED', issuedTo: 'std_15' },
  { isbn: '978-03', title: 'Mathematics Class X', author: 'R.D. Sharma', status: 'AVAILABLE' },
  { isbn: '978-04', title: 'Science Class X', author: 'Lakhmir Singh', status: 'ISSUED', issuedTo: 'std_1' },
  { isbn: '978-05', title: 'History of India', author: 'Bipin Chandra', status: 'AVAILABLE' },
  { isbn: '978-06', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', status: 'AVAILABLE' },
  { isbn: '978-07', title: 'The Discovery of India', author: 'Jawaharlal Nehru', status: 'ISSUED', issuedTo: 'std_17' },
  { isbn: '978-08', title: 'Train to Pakistan', author: 'Khushwant Singh', status: 'AVAILABLE' },
  { isbn: '978-09', title: 'God of Small Things', author: 'Arundhati Roy', status: 'AVAILABLE' },
  { isbn: '978-10', title: 'White Tiger', author: 'Aravind Adiga', status: 'ISSUED', issuedTo: 'std_18' },
  // ... (Assume 20 more for brevity)
];

// --- 4. BUSES ---
export const DUMMY_BUSES: Bus[] = [
  { id: 'bus_1', plateNumber: 'DL-1PC-0001', driverName: 'Ramesh Singh', capacity: 40, routeId: 'R-01', insuranceExpiry: '2025-01-01' },
  { id: 'bus_2', plateNumber: 'DL-1PC-0002', driverName: 'Suresh Kumar', capacity: 35, routeId: 'R-02', insuranceExpiry: '2025-02-01' },
  { id: 'bus_3', plateNumber: 'DL-1PC-0003', driverName: 'Mahesh Yadav', capacity: 50, routeId: 'R-03', insuranceExpiry: '2025-03-01' },
  { id: 'bus_4', plateNumber: 'DL-1PC-0004', driverName: 'Dinesh Gupta', capacity: 40, routeId: 'R-04', insuranceExpiry: '2025-04-01' },
  { id: 'bus_5', plateNumber: 'DL-1PC-0005', driverName: 'Ganesh Acharya', capacity: 35, routeId: 'R-05', insuranceExpiry: '2025-05-01' },
  { id: 'bus_6', plateNumber: 'DL-1PC-0006', driverName: 'Mukesh Ambani', capacity: 60, routeId: 'R-06', insuranceExpiry: '2025-06-01' },
  { id: 'bus_7', plateNumber: 'DL-1PC-0007', driverName: 'Anil Kapoor', capacity: 40, routeId: 'R-07', insuranceExpiry: '2025-07-01' },
  { id: 'bus_8', plateNumber: 'DL-1PC-0008', driverName: 'Salman Khan', capacity: 35, routeId: 'R-08', insuranceExpiry: '2025-08-01' },
  { id: 'bus_9', plateNumber: 'DL-1PC-0009', driverName: 'Shahrukh Khan', capacity: 50, routeId: 'R-09', insuranceExpiry: '2025-09-01' },
  { id: 'bus_10', plateNumber: 'DL-1PC-0010', driverName: 'Aamir Khan', capacity: 40, routeId: 'R-10', insuranceExpiry: '2025-10-01' },
];

// --- 5. HOSTEL ---
export const DUMMY_HOSTEL: HostelRoom[] = [
  { roomNumber: '101', capacity: 4, occupied: 3, gender: 'BOYS', students: ['std_1', 'std_3', 'std_5'] },
  { roomNumber: '102', capacity: 4, occupied: 4, gender: 'BOYS', students: ['std_7', 'std_9', 'std_11', 'std_13'] },
  { roomNumber: '103', capacity: 2, occupied: 1, gender: 'BOYS', students: ['std_15'] },
  { roomNumber: '201', capacity: 4, occupied: 2, gender: 'GIRLS', students: ['std_2', 'std_4'] },
  { roomNumber: '202', capacity: 4, occupied: 4, gender: 'GIRLS', students: ['std_6', 'std_8', 'std_10', 'std_12'] },
  { roomNumber: '203', capacity: 2, occupied: 0, gender: 'GIRLS', students: [] },
  // ...
];

// --- 6. INVOICES & TRANSACTIONS ---
export const DUMMY_INVOICES: Invoice[] = [
  { id: 'INV-001', studentId: 'std_1', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PAID', utr: 'UPI123456789012' },
  { id: 'INV-002', studentId: 'std_2', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PENDING' },
  { id: 'INV-003', studentId: 'std_3', amount: 2500, description: 'Bus Fees', dueDate: '2024-04-10', status: 'VERIFIED', utr: 'NEFT0987654321' },
  { id: 'INV-004', studentId: 'std_4', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PENDING' },
  { id: 'INV-005', studentId: 'std_5', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PAID', utr: 'UPI987654321098' },
];

// --- MASTER EXPORT ---
export const SOVEREIGN_GENESIS_DATA = {
  students: DUMMY_STUDENTS,
  staff: DUMMY_STAFF,
  books: DUMMY_BOOKS,
  buses: DUMMY_BUSES,
  hostel: DUMMY_HOSTEL,
  invoices: DUMMY_INVOICES
};
