
import React, { useState, useEffect } from 'react';
import { SchoolConfig, User, UserRole, AuthResponse } from '../../../../types';
import { SovereignButton, SovereignInput } from '../../../../packages/app/components/SovereignComponents';
import { ShieldCheck, Lock, User as UserIcon, Loader2, Fingerprint } from 'lucide-react';
import { Platform, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

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

  // Check Biometrics Support (Native Only)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // In a real native build, import and use expo-local-authentication here
      // For this Universal Web preview, we disable biometrics to avoid crashes
    }
  }, []);

  // Biometric Auth Handler
  const handleBiometricLogin = async () => {
    if (!savedSession) return;
    // Native Logic would go here
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
      
      onLoginSuccess(authData);
      setLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: '100%' }}>
        
        {/* LEFT PANEL: BRANDING (Web Only) */}
        {Platform.OS === 'web' && (
          <View style={{ display: 'flex', width: '50%', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' }} className="hidden lg:flex">
            <View className="relative z-20 items-center px-12 max-w-lg">
               <View className="mb-8 justify-center">
                 <View className="w-24 h-24 bg-white/5 rounded-2xl items-center justify-center border border-white/10 shadow-2xl">
                    <ShieldCheck className="w-12 h-12 text-emerald-400" />
                 </View>
               </View>
               <Text className="text-5xl font-black text-white tracking-tight mb-6">
                 PROJECT <Text className="text-emerald-400">SOVEREIGN</Text>
               </Text>
               <Text className="text-slate-300 text-lg leading-relaxed font-light text-center">
                 The offline-first, zero-fee ERP designed for the next generation of Indian education.
               </Text>
            </View>
          </View>
        )}

        {/* RIGHT PANEL: ACTION ZONE */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F9FAFB' }}>
            <View style={{ width: '100%', maxWidth: 400, backgroundColor: 'white', padding: 32, borderRadius: 16, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                  {Platform.OS !== 'web' && <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />}
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Welcome Back</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Sign in to your sovereign dashboard</Text>
                </View>

                <View style={{ gap: 24 }}>
                  <SovereignInput 
                    label="User ID" 
                    placeholder="e.g. demo.principal" 
                    icon={<UserIcon className="w-4 h-4 text-gray-500" />}
                    value={username}
                    onChangeText={setUsername}
                  />
                  <SovereignInput 
                    label="Password" 
                    placeholder="••••••••" 
                    secureTextEntry
                    icon={<Lock className="w-4 h-4 text-gray-500" />}
                    value={password}
                    onChangeText={setPassword}
                  />

                  {error ? (
                    <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FECACA' }}>
                      <Text style={{ color: '#B91C1C', fontSize: 12, fontWeight: 'bold' }}>⚠️ {error}</Text>
                    </View>
                  ) : null}

                  <SovereignButton onPress={() => performLogin(username, password)} isLoading={loading} style={{ width: '100%', paddingVertical: 12 }}>
                    Secure Login
                  </SovereignButton>

                  {isBiometricAvailable && savedSession && (
                    <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', alignItems: 'center' }}>
                       <TouchableOpacity 
                         onPress={handleBiometricLogin}
                         style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', paddingVertical: 12, backgroundColor: '#EEF2FF', borderRadius: 8 }}
                       >
                          <Fingerprint className="w-5 h-5 text-indigo-700" /> 
                          <Text style={{ color: '#4338CA', fontWeight: 'bold' }}>Quick Biometric Login</Text>
                       </TouchableOpacity>
                    </View>
                  )}
                </View>
            </View>
         </View>
      </View>
    </SafeAreaView>
  );
}
