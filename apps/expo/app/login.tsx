
import React, { useState } from 'react';
import { SchoolConfig, User, UserRole, AuthResponse } from '../../../../types';
import { SovereignButton, SovereignInput } from '../../../../packages/app/components/SovereignComponents';
import { ShieldCheck, School, Lock, User as UserIcon } from 'lucide-react';

// Mock DB of Schools
const MOCK_SCHOOL_DB: Record<string, SchoolConfig> = {
  'demo': {
    school_id: 'sch_123',
    name: 'Sovereign High School',
    logo_url: 'https://picsum.photos/200',
    primary_color: '#059669', // Emerald Green
    features: { attendance: true, fees: true, transport: true, library: true, hostel: true },
    location: { lat: 28.6139, lng: 77.2090 },
    upi_vpa: 'school@upi'
  },
  'dav': {
    school_id: 'sch_456',
    name: 'DAV Public School',
    logo_url: '',
    primary_color: '#DC2626', // Red
    features: { attendance: true, fees: false, transport: false, library: true, hostel: false },
    location: { lat: 19.0760, lng: 72.8777 },
    upi_vpa: 'dav@upi'
  }
};

const QUICK_LOGIN_GROUPS = {
  Management: [
    { role: 'super', label: 'Super Admin' },
    { role: 'admin', label: 'HR Admin' },
    { role: 'principal', label: 'Principal' },
    { role: 'vice_principal', label: 'Vice Prin.' },
    { role: 'finance', label: 'Finance' },
  ],
  Operations: [
    { role: 'admissions', label: 'Admissions' },
    { role: 'exam', label: 'Exam Cell' },
    { role: 'fleet', label: 'Transport' },
    { role: 'librarian', label: 'Librarian' },
    { role: 'warden', label: 'Warden' },
    { role: 'nurse', label: 'Nurse' },
    { role: 'inventory', label: 'Inventory' },
    { role: 'security', label: 'Security' },
    { role: 'estate', label: 'Estate' },
    { role: 'it', label: 'IT Admin' },
  ],
  Users: [
    { role: 'teacher', label: 'Teacher' },
    { role: 'parent', label: 'Parent' },
    { role: 'student', label: 'Student' },
    { role: 'hod', label: 'HOD' },
    { role: 'counselor', label: 'Counselor' },
    { role: 'receptionist', label: 'Reception' },
  ]
};

interface Props {
  onLoginSuccess: (data: AuthResponse) => void;
}

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const parts = username.split('.');
      const schoolPrefix = parts[0];
      const roleSuffix = parts[1];
      const schoolConfig = MOCK_SCHOOL_DB[schoolPrefix];

      if (!schoolConfig) {
        setError('School not found. Try "demo.admin"');
        setLoading(false);
        return;
      }

      let userRole = UserRole.STUDENT;
      let userName = 'Student';

      // Advanced Role Logic
      if (roleSuffix === 'super') userRole = UserRole.SUPER_ADMIN;
      else if (Object.values(UserRole).includes(roleSuffix.toUpperCase() as UserRole)) {
         userRole = roleSuffix.toUpperCase() as UserRole;
         userName = roleSuffix.charAt(0).toUpperCase() + roleSuffix.slice(1).replace('_', ' ');
      } else {
        // Fallback for simple map
        const roleMap: Record<string, UserRole> = {
          'admin': UserRole.SCHOOL_ADMIN,
          'principal': UserRole.PRINCIPAL,
          'finance': UserRole.FINANCE_MANAGER,
          'teacher': UserRole.TEACHER,
          'parent': UserRole.PARENT,
          'student': UserRole.STUDENT,
          'fleet': UserRole.FLEET_MANAGER,
          'nurse': UserRole.NURSE,
          'warden': UserRole.WARDEN,
          'hod': UserRole.HOD
        };
        if (roleMap[roleSuffix]) {
           userRole = roleMap[roleSuffix];
           userName = roleSuffix.charAt(0).toUpperCase() + roleSuffix.slice(1);
        } else {
           setError('Invalid Role Suffix.');
           setLoading(false);
           return;
        }
      }

      const user: User = {
        id: `usr_${Date.now()}`,
        name: userName,
        role: userRole,
        school_id: schoolConfig.school_id
      };

      onLoginSuccess({ user, school: schoolConfig });
    }, 800);
  };

  const QuickLoginChip = ({ role, label }: { role: string, label: string }) => (
    <button
      type="button"
      onClick={() => setUsername(`demo.${role}`)}
      className="px-2 py-1.5 text-[10px] font-bold bg-white border border-gray-200 rounded shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors truncate"
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans">
      
      {/* LEFT PANEL: BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900/90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-20 text-center px-12 max-w-lg">
           <div className="mb-8 flex justify-center">
             <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-emerald-400 drop-shadow-lg" />
             </div>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tight mb-6">
             PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SOVEREIGN</span>
           </h1>
           <p className="text-slate-300 text-lg leading-relaxed font-light">
             The offline-first, zero-fee ERP designed for the next generation of Indian education.
           </p>
           
           <div className="mt-12 flex justify-center gap-6">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-bold text-white uppercase tracking-widest">System Online</span>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL: ACTION ZONE */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-50 relative overflow-y-auto">
         <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
            
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                  <p className="text-sm text-gray-500 mt-1">Sign in to your dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  <SovereignInput 
                    label="User ID" 
                    placeholder="e.g. demo.principal" 
                    icon={<UserIcon className="w-4 h-4" />}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <SovereignInput 
                    label="Password" 
                    type="password"
                    placeholder="••••••••" 
                    icon={<Lock className="w-4 h-4" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {error && (
                    <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 flex items-center font-bold">
                      ⚠️ {error}
                    </div>
                  )}

                  <SovereignButton type="submit" isLoading={loading} className="w-full py-3 text-base shadow-indigo-500/20">
                    Secure Login
                  </SovereignButton>
                </form>
            </div>

            {/* QUICK LOGIN HUB */}
            <div className="w-full max-w-md mt-8">
               <div className="flex items-center gap-4 mb-4">
                 <div className="h-px bg-gray-200 flex-1" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Developer Hub</span>
                 <div className="h-px bg-gray-200 flex-1" />
               </div>

               <div className="space-y-4">
                  {Object.entries(QUICK_LOGIN_GROUPS).map(([category, roles]) => (
                    <div key={category} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                       <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">{category}</h3>
                       <div className="grid grid-cols-3 gap-2">
                          {roles.map(r => (
                            <QuickLoginChip key={r.role} role={r.role} label={r.label} />
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

         </div>
         
         <div className="p-4 text-center">
            <p className="text-[10px] text-gray-400 font-mono">
              v2.4.0-stable • Sovereign Encryption Active
            </p>
         </div>
      </div>
    </div>
  );
}
