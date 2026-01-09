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

export const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  school, 
  activeModule, 
  setActiveModule,
  isOpen,
  onClose
}) => {
  
  // Define Menu Items per Role
  const getMenuItems = () => {
    switch(role) {
      case UserRole.SCHOOL_ADMIN:
        return [
          { id: 'DASHBOARD', label: 'Overview', icon: '📊' },
          { id: 'FINANCE', label: 'Finance & Fees', icon: '💰' },
          { id: 'TRANSPORT', label: 'Fleet Manager', icon: '🚌' },
          { id: 'HR', label: 'Staff & HR', icon: '👥' },
          { id: 'LIBRARY', label: 'Library', icon: '📚' },
          { id: 'HOSTEL', label: 'Hostel', icon: '🛏️' },
        ];
      case UserRole.TEACHER:
        return [
          { id: 'ATTENDANCE', label: 'Attendance', icon: '✅' },
          { id: 'GRADEBOOK', label: 'Gradebook', icon: '📝' },
          { id: 'LIBRARY', label: 'Library Check', icon: '📚' },
        ];
      case UserRole.PARENT:
        return [
          { id: 'FEES', label: 'Pay Fees', icon: '💳' },
          { id: 'TRACKING', label: 'Bus Tracking', icon: '📍' },
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
        <div className="flex items-center h-16 px-6 border-b border-gray-200" style={{ backgroundColor: school.primary_color }}>
          <div className="text-white font-bold text-lg tracking-wide truncate">
            {school.name}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  onClose(); // Close on mobile selection
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
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

        {/* User Role Badge */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logged in as</p>
          <p className="text-sm font-bold text-gray-700">{role.replace('_', ' ')}</p>
        </div>
      </div>
    </>
  );
};
