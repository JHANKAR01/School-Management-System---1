
import React, { useState, useEffect } from 'react';
import { SchoolConfig, User, UserRole, AuthResponse } from '../../../../types';
import { SovereignButton, SovereignInput } from '../../../../packages/app/components/SovereignComponents';
import { ShieldCheck, Lock, User as UserIcon, Loader2, Fingerprint } from 'lucide-react';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Mock DB of Schools (Keep existing)
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

const ROLE_SUFFIX_MAP: Record<string, UserRole> = {
  'super': UserRole.SUPER_ADMIN,
  'admin': UserRole.SCHOOL_ADMIN,
  'principal': UserRole.PRINCIPAL,
  'vice_principal': UserRole.VICE_PRINCIPAL,
  'finance': UserRole.FINANCE_MANAGER,
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
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [savedSession, setSavedSession] = useState<string | null>(null);

  // Check Biometrics Support
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricAvailable(compatible && enrolled);
        
        const session = await SecureStore.getItemAsync('sovereign_user_session');
        if (session) setSavedSession(session);
      })();
    }
  }, []);

  // Biometric Auth Handler
  const handleBiometricLogin = async () => {
    if (!savedSession) return;
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access Sovereign ERP',
      fallbackLabel: 'Use Passcode'
    });

    if (result.success) {
      setLoading(true);
      setTimeout(() => {
        const sessionData = JSON.parse(savedSession);
        // Refresh token logic would go here
        onLoginSuccess(sessionData);
        setLoading(false);
      }, 500);
    }
  };

  const performLogin = async (userStr: string, passStr: string) => {
    setLoading(true);
    setError('');

    setTimeout(async () => {
      const parts = userStr.split('.');
      const schoolPrefix = parts[0];
      const roleSuffix = parts.slice(1).join('_');

      const schoolConfig = MOCK_SCHOOL_DB[schoolPrefix];

      if (!schoolConfig) {
        setError(`School "${schoolPrefix}" not found. Try "demo.admin"`);
        setLoading(false);
        return;
      }

      let userRole = UserRole.STUDENT;
      let userName = 'User';

      if (roleSuffix === 'super') {
        userRole = UserRole.SUPER_ADMIN;
        userName = "Super Admin";
      } else if (ROLE_SUFFIX_MAP[roleSuffix]) {
        userRole = ROLE_SUFFIX_MAP[roleSuffix];
        userName = roleSuffix.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } else {
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

      const authData = { user, school: schoolConfig };
      
      // Save Session Securely on Native
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('sovereign_user_session', JSON.stringify(authData));
      }

      onLoginSuccess(authData);
      setLoading(false);
    }, 500);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
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

                  {isBiometricAvailable && savedSession && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                       <button 
                         type="button" 
                         onClick={handleBiometricLogin}
                         className="flex items-center justify-center gap-2 w-full py-3 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold transition-colors"
                       >
                          <Fingerprint className="w-5 h-5" /> Quick Biometric Login
                       </button>
                    </div>
                  )}
                </form>
            </div>
         </div>
      </div>
    </div>
  );
}
