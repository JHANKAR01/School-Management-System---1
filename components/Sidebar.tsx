import React from 'react';
import { UserRole, SchoolConfig } from '../types';

interface SidebarProps {
  role: UserRole;
  school: SchoolConfig;
  activeModule: string;
  setActiveModule: (module: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  school, 
  activeModule, 
  setActiveModule,
  isOpen,
  onClose
}) => {
  
  // Strict Departmental Isolation Logic
  const getMenuItems = (): MenuItem[] => {
    switch(role) {
      case UserRole.SCHOOL_ADMIN: // HR Manager
        return [
          { id: 'STAFF_MGMT', label: 'Staff & HR', icon: '👥' },
          { id: 'ACCESS_LOGS', label: 'Audit Logs', icon: '🛡️' },
          { id: 'SETTINGS', label: 'School Settings', icon: '⚙️' },
        ];
      
      case UserRole.PRINCIPAL: // Academic Head
        return [
          { id: 'OVERVIEW', label: 'School Overview', icon: '📊' },
          { id: 'CLASSROOMS', label: 'Classrooms', icon: '🏫' },
          { id: 'RESULTS', label: 'Publish Results', icon: '📢' },
          { id: 'ATTENDANCE_REP', label: 'Attendance Reports', icon: '📋' },
        ];

      case UserRole.VICE_PRINCIPAL: // Operations Head
        return [
          { id: 'TIMETABLES', label: 'Timetables', icon: '📅' },
          { id: 'SUBSTITUTIONS', label: 'Substitutions', icon: '🔄' },
          { id: 'SYLLABUS', label: 'Syllabus Tracker', icon: '📉' },
        ];
        
      case UserRole.HOD: // Head of Department
        return [
          { id: 'SYLLABUS', label: 'Syllabus Tracker', icon: '📉' },
          { id: 'LESSON_PLANS', label: 'Lesson Plans', icon: '📝' },
          { id: 'RESOURCES', label: 'Subject Resources', icon: '📂' },
        ];

      case UserRole.FINANCE_MANAGER: // Accountant
        return [
          { id: 'COLLECTIONS', label: 'Fee Collections', icon: '💰' },
          { id: 'RECONCILIATION', label: 'Bank Reconcile', icon: '🏦' },
          { id: 'PAYROLL', label: 'Staff Payroll', icon: '💸' },
        ];

      case UserRole.FLEET_MANAGER: // Transport
        return [
          { id: 'LIVE_TRACKING', label: 'Live Control', icon: '📡' },
          { id: 'FLEET_MGMT', label: 'Buses & Drivers', icon: '🚌' },
          { id: 'ROUTES', label: 'Route Planning', icon: '🗺️' },
        ];
      
      case UserRole.ADMISSIONS_OFFICER:
        return [
          { id: 'INQUIRIES', label: 'Inquiries (CRM)', icon: '📞' },
          { id: 'REGISTRATION', label: 'Student Reg.', icon: '📝' },
        ];

      case UserRole.EXAM_CELL:
        return [
          { id: 'EXAM_SCHEDULE', label: 'Exam Schedule', icon: '🗓️' },
          { id: 'PAPER_INVENTORY', label: 'Paper Inventory', icon: '🖨️' },
        ];

      case UserRole.LIBRARIAN:
        return [
          { id: 'CATALOG', label: 'Book Catalog', icon: '📚' },
          { id: 'CIRCULATION', label: 'Issue/Return', icon: '🔄' },
        ];

      case UserRole.WARDEN:
        return [
          { id: 'ALLOCATION', label: 'Room Allocation', icon: '🛏️' },
          { id: 'NIGHT_ATTENDANCE', label: 'Night Roll Call', icon: '🌙' },
        ];

      case UserRole.NURSE:
        return [
          { id: 'MEDICAL_LOGS', label: 'Infirmary Logs', icon: '🩺' },
          { id: 'VACCINATIONS', label: 'Vaccination Status', icon: '💉' },
        ];

      case UserRole.INVENTORY_MANAGER:
        return [
          { id: 'STOCK_REGISTRY', label: 'Stock Registry', icon: '📦' },
          { id: 'REQUISITIONS', label: 'Staff Requests', icon: '📋' },
        ];
        
      case UserRole.RECEPTIONIST:
        return [
          { id: 'VISITOR_LOGS', label: 'Visitor Logs', icon: '📖' },
          { id: 'APPOINTMENTS', label: 'Appointments', icon: '📅' },
          { id: 'PHONE_INQUIRIES', label: 'Phone Inquiries', icon: '📞' },
        ];
        
      case UserRole.IT_ADMIN:
        return [
          { id: 'SYSTEM_HEALTH', label: 'System Health', icon: '🖥️' },
          { id: 'BIOMETRIC_LOGS', label: 'Biometric Logs', icon: '👆' },
          { id: 'DEVICE_MGMT', label: 'Device Mgmt', icon: '📟' },
        ];

      case UserRole.SECURITY_HEAD:
        return [
          { id: 'GATE_MGMT', label: 'Gate Management', icon: '🚧' },
          { id: 'STAFF_SHIFTS', label: 'Staff Shifts', icon: '👮' },
          { id: 'EMERGENCY_ALERTS', label: 'Emergency Alerts', icon: '🚨' },
        ];

      case UserRole.ESTATE_MANAGER:
        return [
          { id: 'MAINTENANCE_TICKETS', label: 'Maintenance Tickets', icon: '🔧' },
          { id: 'ASSET_REPAIRS', label: 'Asset Repairs', icon: '🏗️' },
          { id: 'UTILITY_BILLS', label: 'Utility Bills', icon: '💡' },
        ];

      case UserRole.COUNSELOR:
        return [
          { id: 'STUDENT_WELLNESS', label: 'Student Wellness', icon: '🧠' },
          { id: 'BEHAVIORAL_LOGS', label: 'Behavioral Logs', icon: '📓' },
          { id: 'PRIVATE_SESSIONS', label: 'Private Sessions', icon: '🛋️' },
        ];

      case UserRole.TEACHER:
        return [
          { id: 'ATTENDANCE', label: 'Attendance', icon: '✅' },
          { id: 'GRADEBOOK', label: 'Gradebook', icon: '📝' },
          { id: 'LIBRARY_CHECK', label: 'Library Status', icon: '📖' },
        ];

      case UserRole.PARENT:
        return [
          { id: 'FEES', label: 'Pay Fees', icon: '💳' },
          { id: 'TRACKING', label: 'Bus Tracking', icon: '📍' },
          { id: 'REPORT', label: 'Report Card', icon: '📜' },
        ];
      
      case UserRole.STUDENT:
        return [
           { id: 'TIMETABLE', label: 'My Timetable', icon: '📅' },
           { id: 'HOMEWORK', label: 'Homework', icon: '🏠' },
           { id: 'REPORT', label: 'Report Card', icon: '📜' },
        ];

      default:
        return [{ id: 'HOME', label: 'Home', icon: '🏠' }];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none border-r border-gray-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex flex-col justify-center h-20 px-6 border-b border-gray-200" style={{ backgroundColor: school.primary_color }}>
          <div className="text-white font-bold text-lg tracking-wide truncate">
            {school.name}
          </div>
          <div className="text-white/80 text-xs font-medium uppercase tracking-wider mt-1">
            {role.replace('_', ' ')} Portal
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  onClose();
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 shadow-sm translate-x-1' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={isActive ? { borderLeft: `4px solid ${school.primary_color}` } : {}}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
               {role[0]}
             </div>
             <div>
               <p className="text-xs font-bold text-gray-900">Signed In</p>
               <p className="text-[10px] text-gray-500 truncate w-32">{role.toLowerCase()}</p>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};
