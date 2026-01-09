import React, { useState, useEffect } from 'react';
import LoginScreen from './apps/expo/app/login';
import SuperAdminOnboarding from './apps/next/pages/super-admin/onboarding.tsx';
import { SchoolConfig, UserRole, LanguageCode } from './types';
import { AttendanceModule } from './components/AttendanceModule';
import { Dashboard } from './components/Dashboard';
import { LanguageProvider, useTranslation } from './packages/app/provider/language-context';
import { useLowDataMode } from './packages/app/hooks/useLowDataMode';
import { generatePalette } from './packages/app/utils/theme-generator';

// Inner component to access Context hooks
const MainApp: React.FC<{
  school: SchoolConfig;
  onLogout: () => void;
}> = ({ school, onLogout }) => {
  const { isLowData, toggleLowData } = useLowDataMode();
  const { language, setLanguage, t } = useTranslation();

  // Dynamic Theme Injection
  useEffect(() => {
    const palette = generatePalette(school.primary_color);
    const root = document.documentElement;
    
    // Inject CSS Variables for Tailwind (simulated) or standard CSS
    Object.entries(palette).forEach(([shade, hex]) => {
      root.style.setProperty(`--color-primary-${shade}`, hex);
    });
    // Set main primary color
    root.style.setProperty('--primary-color', school.primary_color);
    
  }, [school.primary_color]);

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col font-sans"
    >
      <header 
        className="text-white p-4 shadow-md flex items-center justify-between transition-colors duration-300"
        style={{ backgroundColor: school.primary_color }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold overflow-hidden">
             {/* Hide Image in Low Data Mode */}
             {!isLowData && school.logo_url ? (
               <img src={school.logo_url} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               school.name[0]
             )}
          </div>
          <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">{school.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="text-xs bg-white/20 text-white border-0 rounded p-1 cursor-pointer focus:ring-0"
          >
            <option value="en" className="text-gray-900">EN</option>
            <option value="hi" className="text-gray-900">हिंदी</option>
            <option value="mr" className="text-gray-900">मराठी</option>
          </select>

          {/* Low Data Toggle */}
          <button 
            onClick={toggleLowData}
            title="Toggle Low Data Mode"
            className={`p-1.5 rounded ${isLowData ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'}`}
          >
            <span className="text-xs font-bold">{isLowData ? 'Lite' : 'HD'}</span>
          </button>

          <button 
            onClick={onLogout}
            className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30"
          >
            {t('logout')}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-6">
        <Dashboard school={school} />
        
        {school.features.attendance && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h2 className="font-semibold text-gray-800">{t('attendance')} (Offline Ready)</h2>
             </div>
             <AttendanceModule school={school} />
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [currentSchool, setCurrentSchool] = useState<SchoolConfig | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (config: SchoolConfig) => {
    setCurrentSchool(config);
    setUserRole(UserRole.SCHOOL_ADMIN);
  };

  const handleSuperAdminLogin = () => {
    setUserRole(UserRole.SUPER_ADMIN);
  };

  if (userRole === UserRole.SUPER_ADMIN) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
           <button onClick={() => setUserRole(null)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Exit Admin</button>
        </div>
        <SuperAdminOnboarding />
      </>
    );
  }

  if (!currentSchool) {
    return (
      <div className="relative">
        <LoginScreen onLoginSuccess={handleLogin} />
        <button 
          onClick={handleSuperAdminLogin}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-mono shadow-xl opacity-50 hover:opacity-100 transition-opacity"
        >
          Super Admin Login
        </button>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <MainApp school={currentSchool} onLogout={() => setCurrentSchool(null)} />
    </LanguageProvider>
  );
};

export default App;
