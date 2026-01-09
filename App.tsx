import React, { useState, useEffect } from 'react';
import LoginScreen from './apps/expo/app/login';
import SuperAdminOnboarding from './apps/next/pages/super-admin/onboarding.tsx';
import { SchoolConfig, UserRole, LanguageCode, User, AuthResponse } from './types';
import { RoleBasedRouter } from './packages/app/features/dashboard/RoleBasedRouter';
import { Sidebar } from './components/Sidebar';
import { LanguageProvider, useTranslation } from './packages/app/provider/language-context';
import { useLowDataMode } from './packages/app/hooks/useLowDataMode';
import { generatePalette } from './packages/app/utils/theme-generator';

const MainLayout: React.FC<{
  user: User;
  school: SchoolConfig;
  onLogout: () => void;
}> = ({ user, school, onLogout }) => {
  const { isLowData, toggleLowData } = useLowDataMode();
  const { language, setLanguage, t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize default module based on role
  const getDefaultModule = () => {
    switch(user.role) {
      case UserRole.SCHOOL_ADMIN: return 'STAFF_MGMT';
      case UserRole.PRINCIPAL: return 'OVERVIEW';
      case UserRole.VICE_PRINCIPAL: return 'TIMETABLES';
      case UserRole.FINANCE_MANAGER: return 'COLLECTIONS';
      case UserRole.FLEET_MANAGER: return 'LIVE_TRACKING';
      case UserRole.LIBRARIAN: return 'CIRCULATION';
      case UserRole.WARDEN: return 'ALLOCATION';
      case UserRole.ADMISSIONS_OFFICER: return 'INQUIRIES';
      case UserRole.NURSE: return 'MEDICAL_LOGS';
      case UserRole.INVENTORY_MANAGER: return 'STOCK_REGISTRY';
      case UserRole.EXAM_CELL: return 'EXAM_SCHEDULE';
      case UserRole.TEACHER: return 'ATTENDANCE';
      case UserRole.PARENT: return 'FEES';
      default: return 'HOME';
    }
  };

  const [activeModule, setActiveModule] = useState(getDefaultModule());

  // Reset module when user role changes (if hot-swapping users)
  useEffect(() => {
    setActiveModule(getDefaultModule());
  }, [user.role]);

  // Dynamic Theme Injection
  useEffect(() => {
    const palette = generatePalette(school.primary_color);
    const root = document.documentElement;
    Object.entries(palette).forEach(([shade, hex]) => {
      root.style.setProperty(`--color-primary-${shade}`, hex);
    });
    root.style.setProperty('--primary-color', school.primary_color);
  }, [school.primary_color]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* Sidebar Navigation */}
      <Sidebar 
        role={user.role} 
        school={school} 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">
              {school.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
             {/* Role Badge */}
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {user.role}
            </span>

             {/* Low Data Toggle */}
            <button onClick={toggleLowData} className={`p-1.5 rounded border text-xs font-bold transition-colors ${isLowData ? 'bg-yellow-400 border-yellow-500 text-black' : 'bg-gray-100 text-gray-600'}`}>
              {isLowData ? 'Lite Mode' : 'HD Mode'}
            </button>
            
            <button onClick={onLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Switcher */}
        <main className="flex-1 overflow-auto bg-gray-50 relative">
          <RoleBasedRouter 
            role={user.role} 
            school={school} 
            activeModule={activeModule} 
          />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSchool, setCurrentSchool] = useState<SchoolConfig | null>(null);

  const handleLoginSuccess = (data: AuthResponse) => {
    setCurrentUser(data.user);
    setCurrentSchool(data.school);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSchool(null);
  };

  // 1. Super Admin View
  if (currentUser?.role === UserRole.SUPER_ADMIN) {
    return (
      <div className="relative">
        <button 
          onClick={handleLogout} 
          className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
        >
          Exit Super Admin
        </button>
        <SuperAdminOnboarding />
      </div>
    );
  }

  // 2. Login View
  if (!currentUser || !currentSchool) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Role-Based App Layout
  return (
    <LanguageProvider>
      <MainLayout 
        user={currentUser} 
        school={currentSchool} 
        onLogout={handleLogout} 
      />
    </LanguageProvider>
  );
};

export default App;
