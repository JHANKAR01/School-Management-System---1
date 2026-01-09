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
        case 'admin':
          userRole = UserRole.SCHOOL_ADMIN;
          userName = 'HR Manager';
          break;
        case 'principal':
          userRole = UserRole.PRINCIPAL;
          userName = 'Principal Sharma';
          break;
        case 'finance':
          userRole = UserRole.FINANCE_MANAGER;
          userName = 'Mr. Accountant';
          break;
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
        case 'teacher':
          userRole = UserRole.TEACHER;
          userName = 'Radha Miss';
          break;
        case 'parent':
          userRole = UserRole.PARENT;
          userName = 'Mr. Verma';
          break;
        case 'super':
          userRole = UserRole.SUPER_ADMIN;
          userName = 'System Root';
          break;
        default:
          setError('Invalid Role.');
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            PROJECT <span className="text-indigo-600">SOVEREIGN</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure Role-Based Login
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full rounded-t-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="demo.admin / demo.nurse / demo.inventory"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Any password works"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-xs font-bold text-center bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-gray-900 px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 transition-all"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="text-center space-y-2">
           <div className="text-[10px] text-gray-400">
             Quick Test Credentials (prefix 'demo.'):
           </div>
           <div className="flex flex-wrap justify-center gap-2 text-xs font-mono text-indigo-600">
             <button onClick={() => setUsername('demo.admin')} className="hover:underline">Admin (HR)</button>
             <span>|</span>
             <button onClick={() => setUsername('demo.principal')} className="hover:underline">Principal</button>
             <span>|</span>
             <button onClick={() => setUsername('demo.finance')} className="hover:underline">Finance</button>
             <span>|</span>
             <button onClick={() => setUsername('demo.nurse')} className="hover:underline">Nurse</button>
             <span>|</span>
             <button onClick={() => setUsername('demo.admissions')} className="hover:underline">Admissions</button>
             <span>|</span>
             <button onClick={() => setUsername('demo.inventory')} className="hover:underline">Store</button>
           </div>
        </div>
      </div>
    </div>
  );
}
