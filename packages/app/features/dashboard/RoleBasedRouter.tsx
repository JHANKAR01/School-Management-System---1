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
import { AdmissionsDashboard } from '../admissions/AdmissionsDashboard';
import { InfirmaryDashboard } from '../health/InfirmaryDashboard';
import { InventoryDashboard } from '../inventory/InventoryDashboard';

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

const PlaceholderDashboard: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl">🚧</div>
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
    <p className="text-gray-500 max-w-md">{subtitle}</p>
    <div className="mt-6 px-4 py-2 bg-yellow-50 text-yellow-800 text-xs font-bold rounded border border-yellow-200">
      Feature Flag: COMING_SOON
    </div>
  </div>
);

// --- MAIN ROUTER ---

export const RoleBasedRouter: React.FC<Props> = ({ role, school, activeModule }) => {
  
  switch(role) {
    case UserRole.SCHOOL_ADMIN:
      return <StaffManagement />; // HR Only
    
    case UserRole.PRINCIPAL:
      return <PrincipalDashboard activeModule={activeModule} />;

    case UserRole.VICE_PRINCIPAL:
      return (
        <div className="p-6 text-center text-gray-500">
          <h1 className="text-2xl font-bold text-gray-800">Vice Principal Ops</h1>
          <p>Timetable Substitution & Syllabus Tracking Module</p>
        </div>
      );

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
    
    case UserRole.ADMISSIONS_OFFICER:
      return <AdmissionsDashboard />;
      
    case UserRole.NURSE:
      return <InfirmaryDashboard />;
      
    case UserRole.INVENTORY_MANAGER:
      return <InventoryDashboard />;
      
    case UserRole.EXAM_CELL:
      return (
        <div className="p-6 text-center text-gray-500">
          <h1 className="text-2xl font-bold text-gray-800">Exam Cell Secure Zone</h1>
          <p>Question Paper Inventory & Bulk Printing</p>
        </div>
      );

    case UserRole.TEACHER:
      return <TeacherDashboard school={school} activeModule={activeModule} />;

    case UserRole.PARENT:
      return <ParentDashboard school={school} activeModule={activeModule} />;
      
    case UserRole.STUDENT:
      return <ParentDashboard school={school} activeModule={activeModule} />; // Using Parent Dashboard for Student View for MVP

    // --- NEW ROLES (Placeholders) ---
    case UserRole.HOD:
      return <PlaceholderDashboard title="Head of Department Portal" subtitle="Syllabus tracking and lesson plan approval workflows." />;
      
    case UserRole.COUNSELOR:
      return <PlaceholderDashboard title="Counseling & Wellness" subtitle="Private session logs, behavioral tracking, and special education IEPs." />;
      
    case UserRole.RECEPTIONIST:
      return <PlaceholderDashboard title="Front Desk" subtitle="Visitor management logs, appointment scheduling, and phone inquiry CRM." />;
      
    case UserRole.SECURITY_HEAD:
      return <PlaceholderDashboard title="Security Command Center" subtitle="Gate entry/exit logs, staff shift management, and emergency broadcast system." />;
      
    case UserRole.ESTATE_MANAGER:
      return <PlaceholderDashboard title="Estate & Maintenance" subtitle="Asset repair ticketing system, utility bill tracking, and vendor management." />;
      
    case UserRole.IT_ADMIN:
      return <PlaceholderDashboard title="IT Administration" subtitle="System health monitoring, biometric device sync status, and hardware inventory." />;

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          Access Denied or Unknown Role
        </div>
      );
  }
};
