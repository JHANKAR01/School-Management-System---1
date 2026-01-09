
import React, { useState } from 'react';
import { SchoolConfig, User, UserRole, AuthResponse } from '../../../../types';
import { SovereignButton, SovereignInput } from '../../../../packages/app/components/SovereignComponents';
import { ShieldCheck, Lock, User as UserIcon, Check, Loader2 } from 'lucide-react';

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

// Comprehensive Mapping to fix "Invalid Role Suffix"
const ROLE_SUFFIX_MAP: Record<string, UserRole> = {
  // Management
  'super': UserRole.SUPER_ADMIN, // Special case
  'admin': UserRole.SCHOOL_ADMIN,
  'principal': UserRole.PRINCIPAL,
  'vice_principal': UserRole.VICE_PRINCIPAL,
  'finance': UserRole.FINANCE_MANAGER,
  
  // Operations
  'admissions': UserRole.ADMISSIONS_OFFICER,
  'exam': UserRole.EXAM_CELL,
  'fleet': UserRole.FLEET_MANAGER,
  'librarian': UserRole.LIBRARIAN,
  'warden': UserRole.WARDEN,
  'nurse': UserRole.NURSE,
  'inventory': UserRole.INVENTORY_MANAGER,
  'security': UserRole.SECURITY_HEAD,
  'estate': UserRole.ESTATE_MANAGER,
  'it': UserRole.IT_ADMIN,

  // Users
  'teacher': UserRole.TEACHER,
  'parent': UserRole.PARENT,
  'student': UserRole.STUDENT,
  'hod': UserRole.HOD,
  'counselor': UserRole.COUNSELOR,
  'receptionist': UserRole.RECEPTIONIST
};

interface Props {
  onLoginSuccess: (data: AuthResponse) => void;
}

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Unified Login Logic
  const performLogin = async (userStr: string, passStr: string) => {
    setLoading(true);
    setError('');

    // Simulate API Latency for "Fast" feel (reduced to 500ms)
    setTimeout(() => {
      const parts = userStr.split('.');
      const schoolPrefix = parts[0];
      const roleSuffix = parts.slice(1).join('_'); // Handle cases if we ever use multi-word suffixes

      const schoolConfig = MOCK_SCHOOL_DB[schoolPrefix];

      if (!schoolConfig) {
        setError(`School "${schoolPrefix}" not found. Try "demo.admin"`);
        setLoading(false);
        return;
      }

      let userRole = UserRole.STUDENT;
      let userName = 'User';

      // 1. Check Special Super Admin
      if (roleSuffix === 'super') {
        userRole = UserRole.SUPER_ADMIN;
        userName = "Super Admin";
      } 
      // 2. Check Strict Mapping
      else if (ROLE_SUFFIX_MAP[roleSuffix]) {
        userRole = ROLE_SUFFIX_MAP[roleSuffix];
        // Format Name: "it" -> "IT Admin", "vice_principal" -> "Vice Principal"
        userName = roleSuffix
          .split('_')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      } 
      // 3. Fallback / Error
      else {
         console.warn(`Unknown Role Suffix: ${roleSuffix}`);
         setError(`Invalid Role Suffix: ${roleSuffix}`);
         setLoading(false);
         return;
      }

      const user: User = {
        id: `usr_${Date.now()}`,
        name: userName,
        role: userRole,
        school_id: schoolConfig.school_id
      };

      onLoginSuccess({ user, school: schoolConfig });
      setLoading(false); // Just in case unmount doesn't happen immediately
    }, 500);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  };

  const QuickLoginChip = ({ role, label }: { role: string, label: string }) => {
    const targetUsername = `demo.${role}`;
    const isActive = username === targetUsername;

    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => {
          setUsername(targetUsername);
          setPassword('password123');
          performLogin(targetUsername, 'password123'); // Instant Auto-Login
        }}
        className={`px-3 py-2 text-xs font-bold rounded-lg border shadow-sm transition-all flex items-center justify-center gap-1 min-w-[80px] ${
          isActive 
            ? 'bg-indigo-600 border-indigo-700 text-white ring-2 ring-indigo-200' 
            : 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300 hover:border-slate-400 hover:text-slate-900'
        }`}
      >
        {loading && isActive ? <Loader2 className="w-3 h-3 animate-spin" /> : label}
      </button>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 font-sans">
      
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
            
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Sign in to your sovereign dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={handleManualLogin}>
                  <SovereignInput 
                    label="User ID" 
                    placeholder="e.g. demo.principal" 
                    icon={<UserIcon className="w-4 h-4 text-gray-500" />}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <SovereignInput 
                    label="Password" 
                    type="password"
                    placeholder="••••••••" 
                    icon={<Lock className="w-4 h-4 text-gray-500" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {error && (
                    <div className="text-red-700 text-xs bg-red-50 p-3 rounded-lg border border-red-200 flex items-center font-bold">
                      ⚠️ {error}
                    </div>
                  )}

                  <SovereignButton type="submit" isLoading={loading} className="w-full py-3 text-base font-bold shadow-lg shadow-indigo-500/20">
                    Secure Login
                  </SovereignButton>
                </form>
            </div>

            {/* QUICK LOGIN HUB */}
            <div className="w-full max-w-md mt-8">
               <div className="flex items-center gap-4 mb-5">
                 <div className="h-px bg-gray-300 flex-1" />
                 <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Instant Developer Access</span>
                 <div className="h-px bg-gray-300 flex-1" />
               </div>

               <div className="space-y-4">
                  {Object.entries(QUICK_LOGIN_GROUPS).map(([category, roles]) => (
                    <div key={category} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                       <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">{category}</h3>
                       <div className="flex flex-wrap gap-2">
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
              v2.5.1-stable • Sovereign Encryption Active
            </p>
         </div>
      </div>
    </div>
  );
}
