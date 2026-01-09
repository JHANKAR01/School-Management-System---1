import React, { useState } from 'react';
import { SchoolConfig, User, UserRole, AuthResponse } from '../../../../types';

// Mock DB of Schools
const MOCK_SCHOOL_DB: Record<string, SchoolConfig> = {
  'demo': {
    school_id: 'sch_123',
    name: 'Sovereign High School',
    logo_url: 'https://picsum.photos/200',
    primary_color: '#059669', // Emerald Green
    features: { 
      attendance: true, 
      fees: true, 
      transport: true, 
      library: true, 
      hostel: true 
    },
    location: { lat: 28.6139, lng: 77.2090 }, // New Delhi
    upi_vpa: 'school@upi'
  },
  'dav': {
    school_id: 'sch_456',
    name: 'DAV Public School',
    logo_url: '',
    primary_color: '#DC2626', // Red
    features: { 
      attendance: true, 
      fees: false, 
      transport: false, 
      library: true, 
      hostel: false 
    },
    location: { lat: 19.0760, lng: 72.8777 }, // Mumbai
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
      // 1. Detect School from prefix (e.g., demo.admin -> demo)
      const parts = username.split('.');
      const schoolPrefix = parts[0];
      const roleSuffix = parts[1];

      const schoolConfig = MOCK_SCHOOL_DB[schoolPrefix];

      if (!schoolConfig) {
        setError('School not found. Try "demo.admin" or "demo.finance"');
        setLoading(false);
        return;
      }

      // 2. Infer Role & User Details
      let userRole = UserRole.STUDENT;
      let userName = 'Student';

      switch (roleSuffix) {
        // --- MANAGEMENT ---
        case 'super':
          userRole = UserRole.SUPER_ADMIN;
          userName = 'System Root';
          break;
        case 'admin':
          userRole = UserRole.SCHOOL_ADMIN;
          userName = 'HR Manager';
          break;
        case 'principal':
          userRole = UserRole.PRINCIPAL;
          userName = 'Principal Sharma';
          break;
        case 'vice_principal':
          userRole = UserRole.VICE_PRINCIPAL;
          userName = 'Vice Principal Rao';
          break;
        case 'finance':
          userRole = UserRole.FINANCE_MANAGER;
          userName = 'Mr. Accountant';
          break;

        // --- OPERATIONS ---
        case 'fleet':
          userRole = UserRole.FLEET_MANAGER;
          userName = 'Transport Head';
          break;
        case 'librarian':
          userRole = UserRole.LIBRARIAN;
          userName = 'Mrs. Reader';
          break;
        case 'warden':
          userRole = UserRole.WARDEN;
          userName = 'Hostel Warden';
          break;
        case 'nurse':
          userRole = UserRole.NURSE;
          userName = 'Sister Mary';
          break;
        case 'admissions':
          userRole = UserRole.ADMISSIONS_OFFICER;
          userName = 'Admissions Desk';
          break;
        case 'inventory':
          userRole = UserRole.INVENTORY_MANAGER;
          userName = 'Store Keeper';
          break;
        case 'exam':
          userRole = UserRole.EXAM_CELL;
          userName = 'Exam Controller';
          break;
        case 'it':
          userRole = UserRole.IT_ADMIN;
          userName = 'System Admin';
          break;
        case 'security':
          userRole = UserRole.SECURITY_HEAD;
          userName = 'Chief Security Officer';
          break;
        case 'estate':
          userRole = UserRole.ESTATE_MANAGER;
          userName = 'Maintenance Head';
          break;
        
        // --- STAFF & USERS ---
        case 'teacher':
          userRole = UserRole.TEACHER;
          userName = 'Radha Miss';
          break;
        case 'hod':
          userRole = UserRole.HOD;
          userName = 'HOD Science';
          break;
        case 'counselor':
          userRole = UserRole.COUNSELOR;
          userName = 'School Counselor';
          break;
        case 'receptionist':
          userRole = UserRole.RECEPTIONIST;
          userName = 'Front Desk';
          break;
        case 'parent':
          userRole = UserRole.PARENT;
          userName = 'Mr. Verma';
          break;
        case 'student':
          userRole = UserRole.STUDENT;
          userName = 'Aarav Kumar';
          break;

        default:
          setError('Invalid Role Suffix.');
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
    }, 800);
  };

  const QuickLoginButton = ({ suffix, label, color = "bg-gray-100 text-gray-700" }: { suffix: string, label: string, color?: string }) => (
    <button 
      type="button"
      onClick={() => setUsername(`demo.${suffix}`)} 
      className={`text-xs px-2 py-1.5 rounded border border-gray-200 font-medium hover:brightness-95 transition-all text-center ${color}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            PROJECT <span className="text-indigo-600">SOVEREIGN</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure Role-Based Access Gateway
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Login Form */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Credentials</h3>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">User ID</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="demo.admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-600 text-xs font-bold text-center bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* RIGHT: Quick Login Hub */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Login Hub</h3>
             
             <div className="space-y-4">
                {/* Management */}
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 mb-1">MANAGEMENT</p>
                  <div className="grid grid-cols-3 gap-2">
                    <QuickLoginButton suffix="super" label="Super Admin" color="bg-gray-800 text-white" />
                    <QuickLoginButton suffix="admin" label="HR Admin" />
                    <QuickLoginButton suffix="principal" label="Principal" />
                    <QuickLoginButton suffix="vice_principal" label="Vice Prin." />
                    <QuickLoginButton suffix="finance" label="Finance" />
                  </div>
                </div>

                {/* Operations */}
                <div>
                  <p className="text-[10px] font-bold text-orange-600 mb-1">OPERATIONS</p>
                  <div className="grid grid-cols-3 gap-2">
                    <QuickLoginButton suffix="admissions" label="Admissions" />
                    <QuickLoginButton suffix="exam" label="Exam Cell" />
                    <QuickLoginButton suffix="fleet" label="Transport" />
                    <QuickLoginButton suffix="librarian" label="Library" />
                    <QuickLoginButton suffix="warden" label="Hostel" />
                    <QuickLoginButton suffix="nurse" label="Nurse" />
                    <QuickLoginButton suffix="inventory" label="Inventory" />
                    <QuickLoginButton suffix="security" label="Security" />
                    <QuickLoginButton suffix="estate" label="Estate" />
                    <QuickLoginButton suffix="it" label="IT Admin" />
                  </div>
                </div>

                {/* Staff & Users */}
                <div>
                  <p className="text-[10px] font-bold text-green-600 mb-1">USER / STAFF</p>
                  <div className="grid grid-cols-3 gap-2">
                    <QuickLoginButton suffix="teacher" label="Teacher" color="bg-green-50 text-green-700 border-green-200" />
                    <QuickLoginButton suffix="hod" label="HOD" />
                    <QuickLoginButton suffix="counselor" label="Counselor" />
                    <QuickLoginButton suffix="receptionist" label="Reception" />
                    <QuickLoginButton suffix="parent" label="Parent" color="bg-blue-50 text-blue-700 border-blue-200" />
                    <QuickLoginButton suffix="student" label="Student" color="bg-purple-50 text-purple-700 border-purple-200" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
