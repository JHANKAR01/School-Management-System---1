import React from 'react';
import { useAttendance } from '../packages/app/features/attendance/useAttendance';
import { useGeofencing } from '../hooks/useGeofencing';
import { SchoolConfig } from '../types';
import { useTranslation } from '../packages/app/provider/language-context';
import { useLowDataMode } from '../packages/app/hooks/useLowDataMode';

interface Props {
  school: SchoolConfig;
}

const MOCK_STUDENTS = [
  { id: 'st_1', name: 'Aarav Kumar', roll: '01' },
  { id: 'st_2', name: 'Diya Sharma', roll: '02' },
  { id: 'st_3', name: 'Ishaan Patel', roll: '03' },
  { id: 'st_4', name: 'Ananya Gupta', roll: '04' },
];

export const AttendanceModule: React.FC<Props> = ({ school }) => {
  const { markAttendance, isOffline } = useAttendance(school.school_id);
  // In Low Data Mode, we skip high-accuracy GPS polling to save battery/data
  const { isLowData } = useLowDataMode();
  const { isWithinFence, distance, isMockLocation, loading: geoLoading } = useGeofencing(school.location);
  const { t } = useTranslation();
  
  const [marked, setMarked] = React.useState<Record<string, string>>({});

  const handleMark = (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    markAttendance({ studentId, status, date: new Date().toISOString() });
    setMarked(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="p-4">
      {/* Geofence Status Bar (Disabled in Low Data Mode to save battery) */}
      {!isLowData && (
        <div className={`mb-4 p-3 rounded-lg flex justify-between items-center text-sm ${
          isWithinFence ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{isWithinFence ? '📍' : '⚠️'}</span>
            <span>
              {geoLoading ? "Locating..." : 
               isWithinFence ? "Location Verified" : `Outside Boundary (${Math.round(distance || 0)}m)`}
            </span>
          </div>
          {isMockLocation && <span className="font-bold text-red-600">MOCK LOC</span>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_STUDENTS.map(student => (
          <div key={student.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="font-bold text-gray-800">{student.name}</p>
              <p className="text-xs text-gray-500">Roll: {student.roll}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleMark(student.id, 'PRESENT')}
                className={`p-2 rounded-md font-bold text-xs transition-colors w-12 ${
                  marked[student.id] === 'PRESENT' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-green-200'
                }`}
              >
                {t('present')}
              </button>
              <button
                onClick={() => handleMark(student.id, 'ABSENT')}
                className={`p-2 rounded-md font-bold text-xs transition-colors w-12 ${
                  marked[student.id] === 'ABSENT' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-200'
                }`}
              >
                {t('absent')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isOffline || isLowData) && (
         <div className="mt-4 text-xs text-center text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
           {isLowData ? '📶 Low Data Mode: Records batched.' : '🔴 Offline Mode Active.'}
         </div>
      )}
    </div>
  );
};
