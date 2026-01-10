
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
];

// --- 6. INVOICES & TRANSACTIONS ---
export const DUMMY_INVOICES: Invoice[] = [
  { id: 'INV-001', studentId: 'std_1', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PAID', utr: 'UPI123456789012' },
  { id: 'INV-002', studentId: 'std_2', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PENDING' },
  { id: 'INV-003', studentId: 'std_3', amount: 2500, description: 'Bus Fees', dueDate: '2024-04-10', status: 'VERIFIED', utr: 'NEFT0987654321' },
  { id: 'INV-004', studentId: 'std_4', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PENDING' },
  { id: 'INV-005', studentId: 'std_5', amount: 5000, description: 'Term 1 Fees', dueDate: '2024-04-10', status: 'PAID', utr: 'UPI987654321098' },
];

// --- 7. HOMEWORK ---
export const DUMMY_HOMEWORK = [
  { id: 'hw_1', class: '10-A', subject: 'Physics', title: 'Newton Laws', dueDate: '2023-10-28', status: 'PENDING' },
  { id: 'hw_2', class: '10-A', subject: 'Math', title: 'Quadratic Equations', dueDate: '2023-10-29', status: 'SUBMITTED' },
  { id: 'hw_3', class: '9-B', subject: 'History', title: 'Mughal Empire', dueDate: '2023-10-30', status: 'PENDING' },
  { id: 'hw_4', class: '8-A', subject: 'English', title: 'Essay Writing', dueDate: '2023-11-01', status: 'GRADED' },
  { id: 'hw_5', class: '11-Sci', subject: 'Chemistry', title: 'Organic Reactions', dueDate: '2023-10-31', status: 'PENDING' },
];

// --- 8. MEDICAL LOGS ---
export const DUMMY_MEDICAL_LOGS = [
    { id: 1, time: '09:30 AM', student: 'Rohan Gupta (5-A)', issue: 'Fever (101°F)', action: 'Paracetamol given, Parents called', date: '2023-10-27' },
    { id: 2, time: '11:15 AM', student: 'Sneha Patil (8-B)', issue: 'Minor Cut (Playground)', action: 'Dressed & Bandaged', date: '2023-10-27' },
    { id: 3, time: '01:00 PM', student: 'Amit Kumar (10-A)', issue: 'Headache', action: 'Rest in infirmary', date: '2023-10-27' },
    { id: 4, time: '10:00 AM', student: 'Priya Singh (6-B)', issue: 'Stomach Ache', action: 'Given antacid', date: '2023-10-26' },
    { id: 5, time: '02:30 PM', student: 'Rahul Verma (12-Sci)', issue: 'Dizziness', action: 'BP Checked (Normal), Water given', date: '2023-10-26' },
];

// --- 9. VISITOR LOGS (Gate + Reception) ---
export const DUMMY_GATE_LOGS = [
    { id: 1, type: 'VISITOR', name: 'Ramesh Courier', purpose: 'Amazon Delivery', time: '10:30 AM', status: 'EXITED', date: '2023-10-27' },
    { id: 2, type: 'PARENT', name: 'Mrs. Sharma', purpose: 'Fee Payment', time: '11:15 AM', status: 'INSIDE', date: '2023-10-27' },
    { id: 3, type: 'STAFF', name: 'S. Gupta', purpose: 'Late Entry', time: '08:45 AM', status: 'INSIDE', date: '2023-10-27' },
    { id: 4, type: 'VENDOR', name: 'Water Supply', purpose: 'Refill', time: '07:00 AM', status: 'EXITED', date: '2023-10-27' },
    { id: 5, type: 'VISITOR', name: 'Electrician', purpose: 'AC Repair', time: '12:00 PM', status: 'INSIDE', date: '2023-10-27' },
];

export const DUMMY_RECEPTION_VISITORS = [
    { id: 1, name: 'Vikram Singh', student: 'Rohan (6-A)', purpose: 'Meeting Principal', time: '09:00 AM', status: 'WAITING' },
    { id: 2, name: 'Anita Desai', student: 'Priya (10-C)', purpose: 'Early Pickup', time: '12:30 PM', status: 'APPROVED' },
    { id: 3, name: 'Rajesh Koothrappali', student: 'None', purpose: 'Job Interview', time: '11:00 AM', status: 'COMPLETED' },
    { id: 4, name: 'Sheldon Cooper', student: 'None', purpose: 'Guest Lecture', time: '10:00 AM', status: 'COMPLETED' },
];

// --- 10. MAINTENANCE TICKETS ---
export const DUMMY_TICKETS = [
    { id: 'T-101', location: 'Chemistry Lab', issue: 'Leaking Tap', priority: 'MEDIUM', status: 'OPEN', reportedBy: 'HOD Science' },
    { id: 'T-102', location: 'Class 5-B', issue: 'Broken Bench', priority: 'LOW', status: 'ASSIGNED', reportedBy: 'Class Teacher' },
    { id: 'T-103', location: 'Server Room', issue: 'AC Malfunction', priority: 'CRITICAL', status: 'OPEN', reportedBy: 'IT Admin' },
    { id: 'T-104', location: 'Girls Washroom', issue: 'Light not working', priority: 'HIGH', status: 'RESOLVED', reportedBy: 'Housekeeping' },
    { id: 'T-105', location: 'Library', issue: 'Fan noisy', priority: 'LOW', status: 'OPEN', reportedBy: 'Librarian' },
];

// --- 11. SYLLABUS ---
export const DUMMY_SYLLABUS = [
    { id: 1, teacher: 'A. Verma', subject: 'Physics', class: 'X-A', completed: 65, target: 70, status: 'ON_TRACK' },
    { id: 2, teacher: 'S. Khan', subject: 'Chemistry', class: 'X-B', completed: 40, target: 60, status: 'LAGGING' },
    { id: 3, teacher: 'R. Sharma', subject: 'Maths', class: 'X-A', completed: 80, target: 80, status: 'AHEAD' },
    { id: 4, teacher: 'P. Iyer', subject: 'Biology', class: 'IX-A', completed: 50, target: 55, status: 'ON_TRACK' },
    { id: 5, teacher: 'M. Singh', subject: 'History', class: 'VIII-C', completed: 30, target: 45, status: 'CRITICAL' },
];

// --- 12. COUNSELING SESSIONS ---
export const DUMMY_COUNSELING = [
    { id: 1, student: 'Amit Verma (9-C)', category: 'Behavioral', note: 'Showing signs of withdrawal. Recommended art therapy.', date: '2023-10-24' },
    { id: 2, student: 'Neha Kapoor (10-A)', category: 'Academic Stress', note: 'Anxious about boards. Exam fear session conducted.', date: '2023-10-25' },
    { id: 3, student: 'Rahul Singh (8-B)', category: 'Disruptive', note: 'Aggressive in playground. Parent meeting scheduled.', date: '2023-10-26' },
    { id: 4, student: 'Sita Ram (7-A)', category: 'Social', note: 'Difficulty making friends. Peer buddy assigned.', date: '2023-10-23' },
    { id: 5, student: 'John Doe (11-Sci)', category: 'Career', note: 'Confused about stream. Aptitude test scheduled.', date: '2023-10-22' },
];

// --- MASTER EXPORT ---
export const SOVEREIGN_GENESIS_DATA = {
  students: DUMMY_STUDENTS,
  staff: DUMMY_STAFF,
  books: DUMMY_BOOKS,
  buses: DUMMY_BUSES,
  hostel: DUMMY_HOSTEL,
  invoices: DUMMY_INVOICES,
  homework: DUMMY_HOMEWORK,
  medicalLogs: DUMMY_MEDICAL_LOGS,
  gateLogs: DUMMY_GATE_LOGS,
  visitors: DUMMY_RECEPTION_VISITORS,
  tickets: DUMMY_TICKETS,
  syllabus: DUMMY_SYLLABUS,
  counseling: DUMMY_COUNSELING
};
