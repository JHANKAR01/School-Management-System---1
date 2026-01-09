
import React from 'react';
import { SchoolConfig } from '../../../../types';
import { AttendanceModule } from '../../../../components/AttendanceModule';
import { Gradebook } from '../academics/Gradebook';
import { LibraryManagement } from '../library/LibraryManagement';
import { StatCard, PageHeader, SovereignButton } from '../../components/SovereignComponents';
import { Users, BookOpen, Clock, AlertCircle, MapPin } from 'lucide-react';
import { useGeofencing } from '../../../../hooks/useGeofencing';

interface Props {
  school: SchoolConfig;
  activeModule: string;
}

export const TeacherDashboard: React.FC<Props> = ({ school, activeModule }) => {
  const { isWithinFence, isMockLocation, loading: geoLoading } = useGeofencing(school.location);
  const [checkedIn, setCheckedIn] = React.useState(false);

  const handleStaffCheckIn = () => {
    if (isMockLocation) {
      alert("Security Alert: Mock Location Detected. Check-in denied.");
      return;
    }
    if (!isWithinFence) {
      alert("You are outside the school campus. Please enter the gate to check in.");
      return;
    }
    setCheckedIn(true);
    alert("Checked in successfully at " + new Date().toLocaleTimeString());
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <PageHeader 
          title="Classroom Management" 
          subtitle="Class X-A • Mathematics"
        />
        
        {/* Smart Check-In Widget */}
        <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isWithinFence ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <div className="text-xs">
             <p className="font-bold text-gray-700">{geoLoading ? 'Locating...' : (isWithinFence ? 'Inside Campus' : 'Outside Campus')}</p>
             <p className="text-[10px] text-gray-400">{isMockLocation ? '⚠️ GPS Spoofed' : 'GPS Verified'}</p>
          </div>
          <SovereignButton 
            onClick={handleStaffCheckIn} 
            disabled={checkedIn || !isWithinFence || isMockLocation}
            className={`text-xs px-3 py-1.5 h-auto ${checkedIn ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
          >
            {checkedIn ? 'On Duty' : 'Staff Check-In'}
          </SovereignButton>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title="Students Present" value="42/45" trend={{ value: 98, isPositive: true }} icon={<Users className="w-5 h-5" />} />
         <StatCard title="Syllabus" value="75%" subtitle="Chapter 12: Calculus" icon={<BookOpen className="w-5 h-5" />} />
         <StatCard title="Pending HW" value="8" subtitle="Assignments to Grade" icon={<Clock className="w-5 h-5" />} />
         <StatCard title="Alerts" value="2" subtitle="Low Attendance" icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        {activeModule === 'ATTENDANCE' && <AttendanceModule school={school} />}
        {activeModule === 'GRADEBOOK' && <div className="p-6"><Gradebook /></div>}
        {activeModule === 'LIBRARY' && <div className="p-6"><LibraryManagement /></div>}
      </div>
    </div>
  );
};
