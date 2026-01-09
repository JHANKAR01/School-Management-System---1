import React from 'react';
import { SchoolConfig } from '../../../../types';
import { AttendanceModule } from '../../../../components/AttendanceModule';
import { Gradebook } from '../academics/Gradebook';
import { LibraryManagement } from '../library/LibraryManagement';

interface Props {
  school: SchoolConfig;
  activeModule: string;
}

export const TeacherDashboard: React.FC<Props> = ({ school, activeModule }) => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {activeModule === 'ATTENDANCE' && 'Daily Attendance'}
          {activeModule === 'GRADEBOOK' && 'Academic Records'}
          {activeModule === 'LIBRARY' && 'Class Library'}
        </h1>
        <p className="text-sm text-gray-500">
          {activeModule === 'ATTENDANCE' && "Mark student presence. Offline changes will sync automatically."}
          {activeModule === 'GRADEBOOK' && "Enter marks for upcoming term reports."}
        </p>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        {activeModule === 'ATTENDANCE' && (
          <AttendanceModule school={school} />
        )}
        
        {activeModule === 'GRADEBOOK' && (
          <div className="p-4">
            <Gradebook />
          </div>
        )}

        {activeModule === 'LIBRARY' && (
          <div className="p-4">
             {/* Reusing Library Management but teachers usually assume Librarian role or just view */}
             <LibraryManagement />
          </div>
        )}
      </div>
    </div>
  );
};
