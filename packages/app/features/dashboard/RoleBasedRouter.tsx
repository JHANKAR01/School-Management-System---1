import React from 'react';
import { UserRole, SchoolConfig } from '../../../../types';

// Dashboards
import { TeacherDashboard } from './TeacherDashboard';
import { ParentDashboard } from './ParentDashboard';
import { StaffManagement } from '../admin/StaffManagement';

// Feature Components (Departmental Wrappers)
import { BusFleet } from '../transport/BusFleet';
import { LibraryManagement } from '../library/LibraryManagement';
import { HostelWarden } from '../hostel/HostelWarden';
import { Gradebook } from '../academics/Gradebook';
import { useAttendance } from '../attendance/useAttendance';
import { generateUPILink } from '../../../api/src/upi-engine';

interface Props {
  role: UserRole;
  school: SchoolConfig;
  activeModule: string;
}

// --- DEPARTMENTAL DASHBOARDS (Inline for Brevity, logically split) ---

const FinanceDashboard: React.FC<{ school: SchoolConfig, activeModule: string }> = ({ school, activeModule }) => {
  const sampleFeeLink = generateUPILink({
    payeeVPA: school.upi_vpa,
    payeeName: school.name,
    amount: 1500.00,
    transactionNote: "Term 1 Fees",
    transactionRef: "INV-DEMO"
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finance Department</h1>
      {activeModule === 'COLLECTIONS' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Fee Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                 <p className="text-sm text-green-800 font-bold">Total Collected (Today)</p>
                 <p className="text-2xl font-black text-green-900">₹45,200</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                 <p className="text-sm text-blue-800 font-bold">Pending Invoices</p>
                 <p className="text-2xl font-black text-blue-900">12</p>
              </div>
           </div>
           <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase">Direct UPI Link Generator</h3>
              <div className="mt-2 p-3 bg-gray-50 font-mono text-xs break-all border rounded">
                {sampleFeeLink}
              </div>
           </div>
        </div>
      )}
      {activeModule === 'RECONCILIATION' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Bank Reconciliation</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
             <p className="text-gray-500">Upload Bank CSV Statement here to match UTRs.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const PrincipalDashboard: React.FC<{ activeModule: string }> = ({ activeModule }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Principal's Office</h1>
      {activeModule === 'RESULTS' && <Gradebook />}
      {activeModule === 'CLASSROOMS' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center text-gray-500">
          Academic Timetable & Classroom Allocation View
        </div>
      )}
       {activeModule === 'OVERVIEW' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center text-gray-500">
          School-Wide Performance Metrics
        </div>
      )}
    </div>
  );
};

// --- MAIN ROUTER ---

export const RoleBasedRouter: React.FC<Props> = ({ role, school, activeModule }) => {
  
  switch(role) {
    case UserRole.SCHOOL_ADMIN:
      return <StaffManagement />; // HR Only
    
    case UserRole.PRINCIPAL:
      return <PrincipalDashboard activeModule={activeModule} />;

    case UserRole.FINANCE_MANAGER:
      return <FinanceDashboard school={school} activeModule={activeModule} />;

    case UserRole.FLEET_MANAGER:
      return (
        <div className="p-6 h-full flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transport Control Tower</h1>
          <BusFleet />
        </div>
      );

    case UserRole.LIBRARIAN:
      return (
        <div className="p-6">
          <LibraryManagement />
        </div>
      );

    case UserRole.WARDEN:
      return (
        <div className="p-6">
          <HostelWarden />
        </div>
      );

    case UserRole.TEACHER:
      return <TeacherDashboard school={school} activeModule={activeModule} />;

    case UserRole.PARENT:
      return <ParentDashboard school={school} activeModule={activeModule} />;

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          Access Denied or Unknown Role
        </div>
      );
  }
};
