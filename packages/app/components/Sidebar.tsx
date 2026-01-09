
import React from 'react';
import { UserRole, SchoolConfig } from '../../../types';
import { useLowDataMode } from '../hooks/useLowDataMode';
import { getSurface } from '../theme/design-system';

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
  const { isLowData } = useLowDataMode();
  const { features } = school;
  
  // Strict Departmental Isolation Logic + Feature Flags
  const getMenuItems = (): MenuItem[] => {
    let items: MenuItem[] = [];

    switch(role) {
      case UserRole.SCHOOL_ADMIN: // HR Manager
        items = [
          { id: 'STAFF_MGMT', label: 'Staff & HR', icon: '👥' },
          { id: 'ACCESS_LOGS', label: 'Audit Logs', icon: '🛡️' },
          { id: 'SETTINGS', label: 'School Settings', icon: '⚙️' },
        ];
        break;
      
      case UserRole.PRINCIPAL: // Academic Head
        items = [
          { id: 'OVERVIEW', label: 'School Overview', icon: '📊' },
          { id: 'CLASSROOMS', label: 'Classrooms', icon: '🏫' },
          { id: 'RESULTS', label: 'Publish Results', icon: '📢' },
        ];
        if (features.attendance) items.push({ id: 'ATTENDANCE_REP', label: 'Attendance Reports', icon: '📋' });
        break;

      case UserRole.FINANCE_MANAGER: // Accountant
        if (features.fees) {
          items = [
            { id: 'COLLECTIONS', label: 'Fee Collections', icon: '💰' },
            { id: 'RECONCILIATION', label: 'Bank Reconcile', icon: '🏦' },
            { id: 'PAYROLL', label: 'Staff Payroll', icon: '💸' },
          ];
        }
        break;
      
      case UserRole.TEACHER: 
         if (features.attendance) items.push({ id: 'ATTENDANCE', label: 'Attendance', icon: '📋' });
         items.push({ id: 'GRADEBOOK', label: 'Gradebook', icon: '📝' });
         if (features.library) items.push({ id: 'LIBRARY', label: 'Library', icon: '📚' });
         break;

      case UserRole.PARENT:
      case UserRole.STUDENT:
         if (features.fees) items.push({ id: 'FEES', label: 'Fees & Dues', icon: '💳' });
         if (features.transport) items.push({ id: 'TRACKING', label: 'Bus Tracking', icon: '🚌' });
         items.push({ id: 'REPORT', label: 'Report Card', icon: '📄' });
         break;

      case UserRole.FLEET_MANAGER:
          if (features.transport) items.push({ id: 'FLEET', label: 'Live Tracking', icon: '🚌' });
          break;

      case UserRole.LIBRARIAN:
          if (features.library) items.push({ id: 'LIBRARY', label: 'Circulation Desk', icon: '📚' });
          break;

      case UserRole.WARDEN:
          if (features.hostel) items.push({ id: 'HOSTEL', label: 'Room Allocation', icon: '🛏️' });
          break;

      case UserRole.NURSE:
          items.push({ id: 'INFIRMARY', label: 'Health Logs', icon: '🏥' });
          break;

      case UserRole.SECURITY_HEAD:
          items.push({ id: 'GATE', label: 'Gate Logs', icon: '🛡️' });
          break;

      case UserRole.ESTATE_MANAGER:
          items.push({ id: 'TICKETS', label: 'Maintenance', icon: '🔧' });
          break;

      case UserRole.RECEPTIONIST:
          items.push({ id: 'VISITORS', label: 'Front Desk', icon: '🛎️' });
          break;

      case UserRole.ADMISSIONS_OFFICER:
          items.push({ id: 'INQUIRIES', label: 'CRM', icon: '🤝' });
          break;

      case UserRole.HOD:
          items.push({ id: 'SYLLABUS', label: 'Dept. Progress', icon: '📈' });
          break;
      
      case UserRole.EXAM_CELL:
          items.push({ id: 'EXAMS', label: 'Papers & Logistics', icon: '🖨️' });
          break;

      case UserRole.COUNSELOR:
          items.push({ id: 'WELLNESS', label: 'Student Wellness', icon: '🧠' });
          break;

      case UserRole.IT_ADMIN:
          items.push({ id: 'SYSTEM', label: 'Infrastructure', icon: '🖥️' });
          break;
      
      default:
        items = [
          { id: 'HOME', label: 'Home', icon: '🏠' },
          { id: 'PROFILE', label: 'My Profile', icon: '👤' },
        ];
    }
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none border-r border-gray-200 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 relative overflow-hidden" style={{ backgroundColor: school.primary_color }}>
           {/* Decorative sheen */}
           <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
           
           <div className="relative z-10 text-white">
             <h1 className="font-bold text-lg tracking-wide truncate shadow-sm">{school.name}</h1>
             <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider opacity-90 mt-0.5">
               {role.replace('_', ' ')} Portal
             </p>
           </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  onClose();
                }}
                className={`flex w-full items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gray-50 text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1" 
                    style={{ backgroundColor: school.primary_color }} 
                  />
                )}
                
                <span className={`mr-3 text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold shadow-inner">
               {role[0]}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-gray-900 truncate">Logged In</p>
               <p className="text-[10px] text-gray-500 truncate capitalize">{role.toLowerCase().replace('_', ' ')}</p>
             </div>
             {isLowData && (
                <span className="w-2 h-2 rounded-full bg-yellow-400" title="Low Data Mode Active" />
             )}
          </div>
        </div>
      </div>
    </>
  );
};
