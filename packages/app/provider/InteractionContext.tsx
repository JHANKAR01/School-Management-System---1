
import React, { createContext, useContext, useState } from 'react';
import { SOVEREIGN_GENESIS_DATA } from '../../api/src/data/dummy-data';

// --- Types reflecting Prisma Schema ---
export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED'; // Student view status
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

export interface InteractionContextType {
  // Data
  homeworks: Homework[];
  leaves: LeaveApplication[];
  liveClasses: Record<string, boolean>; // subject -> boolean
  syllabus: typeof SOVEREIGN_GENESIS_DATA.syllabus;
  exams: Exam[];
  
  // Actions
  addHomework: (hw: Omit<Homework, 'id' | 'status'>) => void;
  submitHomework: (id: string) => void;
  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'status' | 'teacherName'>) => void;
  updateLeaveStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  toggleLiveClass: (subject: string, isActive: boolean) => void;
  approveSyllabus: (id: number) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with Genesis Data where applicable or empty lists
  const [homeworks, setHomeworks] = useState<Homework[]>(
    SOVEREIGN_GENESIS_DATA.homework.map(h => ({ ...h, status: h.status as any, description: 'Read Chapter 4', classId: h.class }))
  );
  
  const [leaves, setLeaves] = useState<LeaveApplication[]>([
    { id: 'l1', teacherName: 'Mrs. S. Gupta', type: 'SICK', startDate: '2023-11-01', endDate: '2023-11-02', reason: 'Viral Fever', status: 'PENDING' }
  ]);
  
  const [liveClasses, setLiveClasses] = useState<Record<string, boolean>>({});
  
  const [syllabus, setSyllabus] = useState(SOVEREIGN_GENESIS_DATA.syllabus);
  
  const [exams, setExams] = useState<Exam[]>([]);

  // Actions
  const addHomework = (hw: Omit<Homework, 'id' | 'status'>) => {
    const newHw: Homework = { ...hw, id: `hw_${Date.now()}`, status: 'PENDING' };
    setHomeworks(prev => [newHw, ...prev]);
  };

  const submitHomework = (id: string) => {
    setHomeworks(prev => prev.map(h => h.id === id ? { ...h, status: 'SUBMITTED' } : h));
  };

  const applyLeave = (leave: Omit<LeaveApplication, 'id' | 'status' | 'teacherName'>) => {
    const newLeave: LeaveApplication = { 
      ...leave, 
      id: `lv_${Date.now()}`, 
      status: 'PENDING',
      teacherName: 'Current User' // In a real app, this comes from auth
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const toggleLiveClass = (subject: string, isActive: boolean) => {
    setLiveClasses(prev => ({ ...prev, [subject]: isActive }));
  };

  const approveSyllabus = (id: number) => {
    setSyllabus(prev => prev.map(s => s.id === id ? { ...s, status: 'COMPLETED' } : s)); // Using 'COMPLETED' as approved for this demo
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams(prev => [{ ...exam, id: `ex_${Date.now()}` }, ...prev]);
  };

  return (
    <InteractionContext.Provider value={{
      homeworks, leaves, liveClasses, syllabus, exams,
      addHomework, submitHomework, applyLeave, updateLeaveStatus, toggleLiveClass, approveSyllabus, addExam
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
