
import React, { createContext, useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { SOVEREIGN_GENESIS_DATA } from '../../api/src/data/dummy-data';
import { UserRole, Invoice, Bus, Book, HostelRoom, MedicalLog } from '../../../types';

// --- ACADEMIC TYPES ---
export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  classId: string;
}

export interface LeaveApplication {
  id: string;
  teacherName: string;
  type: 'SICK' | 'CASUAL' | 'EARNED';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  classes: string[];
}

export interface StudentProfile {
    id: string;
    name: string;
    class: string;
    roll: number;
}

// --- OPERATIONS TYPES ---
export interface Inquiry {
  id: number;
  parent_name: string;
  phone: string;
  target_class: string;
  status: 'NEW' | 'FOLLOW_UP' | 'CONVERTED';
}

export interface Visitor {
  id: number;
  name: string;
  student?: string;
  purpose: string;
  time: string;
  status: 'WAITING' | 'APPROVED' | 'COMPLETED';
}

export interface Ticket {
  id: string;
  location: string;
  issue: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED' | 'ASSIGNED' | 'PENDING';
  reportedBy: string;
}

export interface GateLog {
  id: number;
  type: string;
  name: string;
  purpose: string;
  time: string;
  status: 'INSIDE' | 'EXITED';
  date: string;
}

export interface LocalStaff {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  joinedAt: string;
}

// --- FINANCE TYPES ---
export interface Expense {
  id: string;
  category: 'UTILITY' | 'VENDOR' | 'SALARY' | 'MAINTENANCE';
  amount: number;
  description: string;
  date: string;
}

// --- FLEET TYPES ---
export interface LiveBus extends Bus {
  status: 'IDLE' | 'ON_ROUTE' | 'MAINTENANCE';
  lat: number;
  lng: number;
  speed: number;
}

export interface InteractionContextType {
  // Academic Data
  homeworks: Homework[];
  leaves: LeaveApplication[];
  liveClasses: Record<string, boolean>;
  syllabus: typeof SOVEREIGN_GENESIS_DATA.syllabus;
  exams: Exam[];
  students: StudentProfile[];
  
  // Operations Data
  inquiries: Inquiry[];
  visitors: Visitor[];
  tickets: Ticket[];
  gateLogs: GateLog[];
  localStaff: LocalStaff[];
  lockdownMode: boolean;

  // Finance Data
  invoices: Invoice[];
  expenses: Expense[];

  // Facilities Data
  buses: LiveBus[];
  books: Book[];
  medicalLogs: MedicalLog[];
  hostelRooms: HostelRoom[];

  // Academic Actions
  addHomework: (hw: Omit<Homework, 'id' | 'status'>) => void;
  submitHomework: (id: string) => void;
  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'status' | 'teacherName'>) => void;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  toggleLiveClass: (subject: string, isActive: boolean) => void;
  approveSyllabus: (id: number) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;

  // Operations Actions
  addInquiry: (inq: Omit<Inquiry, 'id' | 'status'>) => void;
  convertInquiry: (id: number) => void;
  addVisitor: (vis: Omit<Visitor, 'id' | 'status' | 'time'>) => void;
  approveVisitor: (id: number) => void;
  addTicket: (ticket: Omit<Ticket, 'id' | 'status'>) => void;
  resolveTicket: (id: string) => void;
  logGateEntry: (entry: Omit<GateLog, 'id' | 'time' | 'date'>) => void;
  addStaff: (staff: Omit<LocalStaff, 'id'>) => void;
  toggleLockdown: () => void;

  // Finance Actions
  addInvoice: (inv: Omit<Invoice, 'id' | 'status'>) => void;
  markInvoicePaid: (id: string, method: 'CASH' | 'CHEQUE' | 'ONLINE') => void;
  addExpense: (exp: Omit<Expense, 'id' | 'date'>) => void;

  // Facilities Actions
  updateBusStatus: (id: string, status: LiveBus['status']) => void;
  assignBusDriver: (busId: string, driverName: string) => void;
  
  // Library Actions
  addBook: (book: Book) => void;
  issueBook: (isbn: string, studentId: string) => void;
  returnBook: (isbn: string) => void;

  // Health Actions
  addMedicalLog: (log: Omit<MedicalLog, 'id' | 'time' | 'date'>) => void;

  // Hostel Actions
  allocateRoom: (roomNumber: string, studentId: string) => void;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- ACADEMIC STATE ---
  const [homeworks, setHomeworks] = useState<Homework[]>(
    SOVEREIGN_GENESIS_DATA.homework.map(h => ({ ...h, status: h.status as any, description: 'Read Chapter 4', classId: h.class }))
  );
  const [leaves, setLeaves] = useState<LeaveApplication[]>([
    { id: 'l1', teacherName: 'Mrs. S. Gupta', type: 'SICK', startDate: '2023-11-01', endDate: '2023-11-02', reason: 'Viral Fever', status: 'PENDING' }
  ]);
  const [liveClasses, setLiveClasses] = useState<Record<string, boolean>>({});
  const [syllabus, setSyllabus] = useState(SOVEREIGN_GENESIS_DATA.syllabus);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>(SOVEREIGN_GENESIS_DATA.students);

  // --- OPERATIONS STATE ---
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    { id: 1, parent_name: 'Mrs. Verma', phone: '9876543210', target_class: 'Class 5', status: 'NEW' },
    { id: 2, parent_name: 'Mr. Singh', phone: '9988776655', target_class: 'Class 8', status: 'FOLLOW_UP' },
  ]);
  const [visitors, setVisitors] = useState<Visitor[]>(SOVEREIGN_GENESIS_DATA.visitors as Visitor[]);
  const [tickets, setTickets] = useState<Ticket[]>(SOVEREIGN_GENESIS_DATA.tickets as Ticket[]);
  const [gateLogs, setGateLogs] = useState<GateLog[]>(SOVEREIGN_GENESIS_DATA.gateLogs as GateLog[]);
  const [localStaff, setLocalStaff] = useState<LocalStaff[]>(
    SOVEREIGN_GENESIS_DATA.staff.map(s => ({
       id: s.id, name: s.name, role: s.role, department: s.department, joinedAt: '2023-01-15'
    }))
  );
  const [lockdownMode, setLockdownMode] = useState(false);

  // --- FINANCE STATE ---
  const [invoices, setInvoices] = useState<Invoice[]>(SOVEREIGN_GENESIS_DATA.invoices);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'exp_1', category: 'UTILITY', amount: 15000, description: 'Electricity Bill Oct', date: '2023-10-25' }
  ]);

  // --- FACILITIES STATE ---
  const [buses, setBuses] = useState<LiveBus[]>(
    SOVEREIGN_GENESIS_DATA.buses.map(b => ({
      ...b,
      status: 'IDLE',
      lat: 28.6139,
      lng: 77.2090,
      speed: 0
    }))
  );
  const [books, setBooks] = useState<Book[]>(SOVEREIGN_GENESIS_DATA.books);
  const [medicalLogs, setMedicalLogs] = useState<MedicalLog[]>(SOVEREIGN_GENESIS_DATA.medicalLogs);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(SOVEREIGN_GENESIS_DATA.hostel);


  // --- FLEET SIMULATION EFFECT ---
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(bus => {
        if (bus.status === 'ON_ROUTE') {
          // Simulate simple movement: zigzag slightly
          const deltaLat = (Math.random() - 0.5) * 0.001;
          const deltaLng = (Math.random() - 0.5) * 0.001;
          return {
            ...bus,
            lat: bus.lat + deltaLat,
            lng: bus.lng + deltaLng,
            speed: Math.floor(Math.random() * 40) + 10 // 10-50 km/h
          };
        }
        return { ...bus, speed: 0 };
      }));
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // --- ACADEMIC ACTIONS ---
  const addHomework = (hw: Omit<Homework, 'id' | 'status'>) => {
    const newHw: Homework = { ...hw, id: `hw_${Date.now()}`, status: 'PENDING' };
    setHomeworks(prev => [newHw, ...prev]);
  };
  const submitHomework = (id: string) => {
    setHomeworks(prev => prev.map(h => h.id === id ? { ...h, status: 'SUBMITTED' } : h));
  };
  const applyLeave = (leave: Omit<LeaveApplication, 'id' | 'status' | 'teacherName'>) => {
    const newLeave: LeaveApplication = { ...leave, id: `lv_${Date.now()}`, status: 'PENDING', teacherName: 'Current User' };
    setLeaves(prev => [newLeave, ...prev]);
  };
  const updateLeaveStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };
  const toggleLiveClass = (subject: string, isActive: boolean) => {
    setLiveClasses(prev => ({ ...prev, [subject]: isActive }));
  };
  const approveSyllabus = (id: number) => {
    setSyllabus(prev => prev.map(s => s.id === id ? { ...s, status: 'COMPLETED' } : s));
  };
  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams(prev => [{ ...exam, id: `ex_${Date.now()}` }, ...prev]);
  };

  // --- OPERATIONS ACTIONS ---
  const addInquiry = (inq: Omit<Inquiry, 'id' | 'status'>) => {
    setInquiries(prev => [{ ...inq, id: Date.now(), status: 'NEW' }, ...prev]);
  };
  const convertInquiry = (id: number) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: 'CONVERTED' } : i));
  };
  const addVisitor = (vis: Omit<Visitor, 'id' | 'status' | 'time'>) => {
    setVisitors(prev => [{ ...vis, id: Date.now(), status: 'WAITING', time: new Date().toLocaleTimeString() }, ...prev]);
  };
  const approveVisitor = (id: number) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'APPROVED' } : v));
  };
  const addTicket = (ticket: Omit<Ticket, 'id' | 'status'>) => {
    setTickets(prev => [{ ...ticket, id: `T-${Date.now()}`, status: 'OPEN' }, ...prev]);
  };
  const resolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'RESOLVED' ? 'PENDING' : 'RESOLVED' } : t));
  };
  const logGateEntry = (entry: Omit<GateLog, 'id' | 'time' | 'date'>) => {
    setGateLogs(prev => [{ ...entry, id: Date.now(), time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() }, ...prev]);
  };
  const addStaff = (staff: Omit<LocalStaff, 'id'>) => {
    setLocalStaff(prev => [{ ...staff, id: `stf_${Date.now()}` }, ...prev]);
  };
  const toggleLockdown = () => {
    setLockdownMode(prev => !prev);
  };

  // --- FINANCE ACTIONS ---
  const addInvoice = (inv: Omit<Invoice, 'id' | 'status'>) => {
    setInvoices(prev => [{ ...inv, id: `INV-${Date.now()}`, status: 'PENDING' }, ...prev]);
  };
  const markInvoicePaid = (id: string, method: 'CASH' | 'CHEQUE' | 'ONLINE') => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv));
  };
  const addExpense = (exp: Omit<Expense, 'id' | 'date'>) => {
    setExpenses(prev => [{ ...exp, id: `exp_${Date.now()}`, date: new Date().toLocaleDateString() }, ...prev]);
  };

  // --- FACILITIES ACTIONS ---
  const updateBusStatus = (id: string, status: LiveBus['status']) => {
    setBuses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };
  const assignBusDriver = (busId: string, driverName: string) => {
    setBuses(prev => prev.map(b => b.id === busId ? { ...b, driverName } : b));
  };
  
  // Library
  const addBook = (book: Book) => setBooks(prev => [...prev, book]);
  const issueBook = (isbn: string, studentId: string) => {
    setBooks(prev => prev.map(b => b.isbn === isbn ? { ...b, status: 'ISSUED', issuedTo: studentId } : b));
  };
  const returnBook = (isbn: string) => {
    setBooks(prev => prev.map(b => b.isbn === isbn ? { ...b, status: 'AVAILABLE', issuedTo: undefined } : b));
  };

  // Health
  const addMedicalLog = (log: Omit<MedicalLog, 'id' | 'time' | 'date'>) => {
    setMedicalLogs(prev => [{ ...log, id: Date.now(), date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }, ...prev]);
  };

  // Hostel
  const allocateRoom = (roomNumber: string, studentId: string) => {
    setHostelRooms(prev => prev.map(r => {
        if (r.roomNumber === roomNumber && r.occupied < r.capacity) {
            return { ...r, occupied: r.occupied + 1, students: [...r.students, studentId] };
        }
        return r;
    }));
  };

  return (
    <InteractionContext.Provider value={{
      homeworks, leaves, liveClasses, syllabus, exams, students,
      inquiries, visitors, tickets, gateLogs, localStaff, lockdownMode,
      invoices, expenses,
      buses, books, medicalLogs, hostelRooms,
      addHomework, submitHomework, applyLeave, updateLeaveStatus, toggleLiveClass, approveSyllabus, addExam,
      addInquiry, convertInquiry, addVisitor, approveVisitor, addTicket, resolveTicket, logGateEntry, addStaff, toggleLockdown,
      addInvoice, markInvoicePaid, addExpense,
      updateBusStatus, assignBusDriver,
      addBook, issueBook, returnBook,
      addMedicalLog, allocateRoom
    }}>
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) throw new Error("useInteraction must be used within InteractionProvider");
  return context;
};
