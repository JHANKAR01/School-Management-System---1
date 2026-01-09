
import React from 'react';
import { UserRole, SchoolConfig } from '../../../../types';

// Dashboards
import { TeacherDashboard } from './TeacherDashboard';
import { ParentDashboard } from './ParentDashboard';
import { StaffManagement } from '../admin/StaffManagement';

// Feature Components
import { BusFleet } from '../transport/BusFleet';
import { LibraryManagement } from '../library/LibraryManagement';
import { HostelWarden } from '../hostel/HostelWarden';
import { Gradebook } from '../academics/Gradebook';
import { AdmissionsDashboard } from '../admissions/AdmissionsDashboard';
import { InfirmaryDashboard } from '../health/InfirmaryDashboard';
import { InventoryDashboard } from '../inventory/InventoryDashboard';

// Components
import { generateUPILink } from '../../../api/src/upi-engine';
import { StatCard, SovereignButton, PageHeader } from '../../components/SovereignComponents';
import { Wallet, Users, AlertCircle, FileText, CheckCircle, TrendingUp, BookOpen, Clock } from 'lucide-react';

interface Props {
  role: UserRole;
  school: SchoolConfig;
  activeModule: string;
}

// --- 1. FINANCE DASHBOARD ---
const FinanceDashboard: React.FC<{ school: SchoolConfig, activeModule: string }> = ({ school, activeModule }) => {
  const sampleFeeLink = generateUPILink({
    payeeVPA: school.upi_vpa,
    payeeName: school.name,
    amount: 1500.00,
    transactionNote: "Term 1 Fees",
    transactionRef: "INV-DEMO"
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Finance Department" subtitle="Ledger & Collection Management" />
      
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title="Total Collected" value="₹45.2L" trend={{ value: 12, isPositive: true }} icon={<Wallet className="w-5 h-5" />} />
         <StatCard title="Pending Dues" value="₹8.4L" trend={{ value: 5, isPositive: false }} icon={<AlertCircle className="w-5 h-5" />} />
         <StatCard title="Expenses" value="₹12.1L" icon={<TrendingUp className="w-5 h-5" />} subtitle="This Month" />
         <StatCard title="Cash on Hand" value="₹3.2L" icon={<CheckCircle className="w-5 h-5" />} />
      </div>

      {activeModule === 'COLLECTIONS' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase">Direct UPI Link Generator</h3>
                <code className="block mt-1 text-xs text-gray-500 font-mono break-all">{sampleFeeLink}</code>
              </div>
              <SovereignButton variant="secondary" onClick={() => navigator.clipboard.writeText(sampleFeeLink)}>Copy</SovereignButton>
           </div>
        </div>
      )}
      {activeModule === 'RECONCILIATION' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏦</div>
          <h2 className="text-xl font-bold text-gray-800">Bank Reconciliation</h2>
          <p className="text-gray-500 mt-2">Upload Bank CSV Statement here to match UTRs.</p>
        </div>
      )}
    </div>
  );
};

// --- 2. PRINCIPAL DASHBOARD ---
const PrincipalDashboard: React.FC<{ activeModule: string }> = ({ activeModule }) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Principal's Office" subtitle="Academic Overview & Analytics" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title="Total Students" value="1,240" trend={{ value: 2, isPositive: true }} icon={<Users className="w-5 h-5" />} />
         <StatCard title="Avg Attendance" value="94%" trend={{ value: 1.5, isPositive: true }} icon={<CheckCircle className="w-5 h-5" />} />
         <StatCard title="Staff Present" value="48/50" icon={<Users className="w-5 h-5" />} subtitle="2 on Leave" />
         <StatCard title="Term Revenue" value="92%" icon={<Wallet className="w-5 h-5" />} subtitle="Collection Rate" />
      </div>

      {activeModule === 'RESULTS' && <Gradebook />}
      {activeModule === 'CLASSROOMS' && (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center text-gray-500">
          Academic Timetable & Classroom Allocation View
        </div>
      )}
       {activeModule === 'OVERVIEW' && (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center text-gray-500">
          School-Wide Performance Metrics Chart
        </div>
      )}
    </div>
  );
};

// --- 3. PLACEHOLDER ---
const PlaceholderDashboard: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
  <div className="p-6 md:p-8 max-w-7xl mx-auto">
    <PageHeader title={title} subtitle={subtitle} />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 opacity-50">
        <StatCard title="Metric 1" value="--" icon={<ActivityIcon />} />
        <StatCard title="Metric 2" value="--" icon={<ActivityIcon />} />
        <StatCard title="Metric 3" value="--" icon={<ActivityIcon />} />
        <StatCard title="Metric 4" value="--" icon={<ActivityIcon />} />
    </div>
    <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-2xl">🚧</div>
      <h3 className="text-lg font-bold text-gray-800">Module Under Construction</h3>
      <p className="text-gray-500 max-w-md mt-2">This Sovereign Module is part of the next scheduled release.</p>
    </div>
  </div>
);

const ActivityIcon = () => <div className="w-5 h-5 bg-gray-200 rounded-full" />;

// --- MAIN ROUTER ---
export const RoleBasedRouter: React.FC<Props> = ({ role, school, activeModule }) => {
  
  switch(role) {
    case UserRole.SCHOOL_ADMIN: return <StaffManagement />;
    case UserRole.PRINCIPAL: return <PrincipalDashboard activeModule={activeModule} />;
    case UserRole.FINANCE_MANAGER: return <FinanceDashboard school={school} activeModule={activeModule} />;
    case UserRole.FLEET_MANAGER: return <div className="p-6"><BusFleet /></div>;
    case UserRole.LIBRARIAN: return <div className="p-6"><LibraryManagement /></div>;
    case UserRole.WARDEN: return <div className="p-6"><HostelWarden /></div>;
    case UserRole.ADMISSIONS_OFFICER: return <AdmissionsDashboard />;
    case UserRole.NURSE: return <InfirmaryDashboard />;
    case UserRole.INVENTORY_MANAGER: return <InventoryDashboard />;
    
    // Complex Dashboards
    case UserRole.TEACHER: return <TeacherDashboard school={school} activeModule={activeModule} />;
    case UserRole.PARENT: 
    case UserRole.STUDENT:
        return <ParentDashboard school={school} activeModule={activeModule} />;

    // Placeholders
    case UserRole.VICE_PRINCIPAL: return <PlaceholderDashboard title="Vice Principal Ops" subtitle="Timetables & Substitution" />;
    case UserRole.EXAM_CELL: return <PlaceholderDashboard title="Exam Cell" subtitle="Question Papers & Printing" />;
    case UserRole.HOD: return <PlaceholderDashboard title="Department Head" subtitle="Syllabus Tracking" />;
    case UserRole.COUNSELOR: return <PlaceholderDashboard title="Counselor" subtitle="Student Wellness Logs" />;
    case UserRole.RECEPTIONIST: return <PlaceholderDashboard title="Reception" subtitle="Visitor Management" />;
    case UserRole.SECURITY_HEAD: return <PlaceholderDashboard title="Security" subtitle="Gate Entry & Alerts" />;
    case UserRole.ESTATE_MANAGER: return <PlaceholderDashboard title="Estate Manager" subtitle="Maintenance Tickets" />;
    case UserRole.IT_ADMIN: return <PlaceholderDashboard title="IT Admin" subtitle="System Health" />;

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          Access Denied or Unknown Role
        </div>
      );
  }
};
