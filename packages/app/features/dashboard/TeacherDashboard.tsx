
import React from 'react';
import { SchoolConfig } from '../../../../types';
import { AttendanceModule } from '../../../../components/AttendanceModule';
import { Gradebook } from '../academics/Gradebook';
import { LibraryManagement } from '../library/LibraryManagement';
import { StatCard, PageHeader } from '../../components/SovereignComponents';
import { Users, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface Props {
  school: SchoolConfig;
  activeModule: string;
}

export const TeacherDashboard: React.FC<Props> = ({ school, activeModule }) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Classroom Management" 
        subtitle="Class X-A • Mathematics"
      />

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
