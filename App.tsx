import React, { useState } from 'react';
import LoginScreen from './apps/expo/app/login';
import { SchoolConfig } from './types';
import { AttendanceModule } from './components/AttendanceModule';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [currentSchool, setCurrentSchool] = useState<SchoolConfig | null>(null);

  // In a real Solito app, this would be handled by Next.js/Expo Router.
  // Here we simulate a simple view switch for the Sovereign Shell.
  
  if (!currentSchool) {
    return (
      <LoginScreen onLoginSuccess={(config) => setCurrentSchool(config)} />
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ '--primary-color': currentSchool.primary_color } as React.CSSProperties}
    >
      {/* Dynamic Header based on School Branding */}
      <header 
        className="text-white p-4 shadow-md flex items-center justify-between"
        style={{ backgroundColor: currentSchool.primary_color }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold overflow-hidden">
             {currentSchool.logo_url ? (
               <img src={currentSchool.logo_url} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               currentSchool.name[0]
             )}
          </div>
          <h1 className="text-xl font-bold">{currentSchool.name}</h1>
        </div>
        <button 
          onClick={() => setCurrentSchool(null)}
          className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-6">
        <Dashboard school={currentSchool} />
        
        {currentSchool.features.attendance && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h2 className="font-semibold text-gray-800">Attendance Module</h2>
             </div>
             <AttendanceModule school={currentSchool} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;