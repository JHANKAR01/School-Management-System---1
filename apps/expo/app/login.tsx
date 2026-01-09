import React, { useState } from 'react';
import { SchoolConfig } from '../../../../types';

// Mock DB of Schools (In prod, this is an API call)
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
  onLoginSuccess: (config: SchoolConfig) => void;
}

// In Solito/Expo, we would use <View>, <Text>, <TextInput> from 'react-native'
// or 'react-native-web'. Here we use standard HTML/Tailwind for the web shell preview.

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API Delay
    setTimeout(() => {
      // "Sovereign Loop": Detect School ID from login (simplified here as username prefix or mapping)
      // Example: 'demo.teacher' -> school 'demo'
      const schoolPrefix = username.split('.')[0];
      const schoolConfig = MOCK_SCHOOL_DB[schoolPrefix];

      if (schoolConfig) {
        // Valid School Found - Fetch Branding & Config
        onLoginSuccess(schoolConfig);
      } else {
        setError('Invalid School ID or Credentials');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            PROJECT <span className="text-indigo-600">SOVEREIGN</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ownership First. Offline Ready.
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
                placeholder="Username (try 'demo.admin')"
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-gray-900 px-3 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In securely'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs text-gray-400 mt-4">
          Tier 3 Ready • Low Data Mode Enabled
        </div>
      </div>
    </div>
  );
}
