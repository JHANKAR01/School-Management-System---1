
import React, { useState } from 'react';
import { SchoolConfig, User, UserRole, AuthResponse } from '../../../../types';
import { SovereignButton } from '../../../../packages/app/components/SovereignComponents';
import { ShieldCheck, School, Lock } from 'lucide-react';

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

      // Infer Role
      let userRole = UserRole.STUDENT;
      let userName = 'Student';

      // Simple mapping for demo
      const roleMap: Record<string, UserRole> = {
        'admin': UserRole.SCHOOL_ADMIN,
        'principal': UserRole.PRINCIPAL,
        'finance': UserRole.FINANCE_MANAGER,
        'teacher': UserRole.TEACHER,
        'parent': UserRole.PARENT,
        'student': UserRole.STUDENT,
        'fleet': UserRole.FLEET_MANAGER,
        'nurse': UserRole.NURSE,
        'security': UserRole.SECURITY_HEAD,
        'it': UserRole.IT_ADMIN
      };

      if (roleMap[roleSuffix]) {
        userRole = roleMap[roleSuffix];
        userName = roleSuffix.charAt(0).toUpperCase() + roleSuffix.slice(1) + " User";
      } else if (roleSuffix === 'super') {
        userRole = UserRole.SUPER_ADMIN;
        userName = 'System Root';
      } else {
        // Default fallbacks for new roles
        if (roleSuffix === 'hod') userRole = UserRole.HOD;
        else if (roleSuffix === 'counselor') userRole = UserRole.COUNSELOR;
        else if (roleSuffix === 'warden') userRole = UserRole.WARDEN;
        else {
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
      className="px-3 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-gray-600 text-center truncate"
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT PANEL: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 text-center px-12">
           <div className="mb-6 flex justify-center">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
             </div>
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Project Sovereign</h1>
           <p className="text-indigo-200 text-lg leading-relaxed max-w-md mx-auto">
             The offline-first, zero-fee ERP designed for the next generation of Indian education.
           </p>
           <div className="mt-12 flex justify-center gap-8 text-white/40">
              <div className="flex flex-col items-center">
                 <School className="w-6 h-6 mb-2" />
                 <span className="text-xs uppercase tracking-widest">Multi-Tenant</span>
              </div>
              <div className="flex flex-col items-center">
                 <Lock className="w-6 h-6 mb-2" />
                 <span className="text-xs uppercase tracking-widest">Sovereign Data</span>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-sm text-gray-600">Access your school's Sovereign Dashboard</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                   <input
                     type="text"
                     required
                     className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                     placeholder="e.g. demo.admin"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                   <input
                     type="password"
                     required
                     className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                   />
                 </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}

              <SovereignButton type="submit" isLoading={loading} className="w-full py-3 text-base">
                Sign In
              </SovereignButton>
            </form>

            <div className="mt-10 pt-10 border-t border-gray-100">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Quick Login Hub (Test Environment)</p>
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <QuickLoginChip role="admin" label="Admin" />
                  <QuickLoginChip role="principal" label="Principal" />
                  <QuickLoginChip role="finance" label="Finance" />
                  <QuickLoginChip role="fleet" label="Fleet" />
                  <QuickLoginChip role="teacher" label="Teacher" />
                  <QuickLoginChip role="parent" label="Parent" />
                  <QuickLoginChip role="nurse" label="Nurse" />
                  <QuickLoginChip role="security" label="Security" />
               </div>
            </div>
         </div>
         
         <p className="absolute bottom-6 text-xs text-gray-400">
           &copy; 2024 Project Sovereign. v1.0.0-beta
         </p>
      </div>
    </div>
  );
}
