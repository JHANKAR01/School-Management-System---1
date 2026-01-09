
import React from 'react';
import { UserRole, SchoolConfig } from '../../../../types';

// Management
import { StaffManagement } from '../admin/StaffManagement';
import { PrincipalDashboard } from '../academics/PrincipalDashboard';
import { VicePrincipalDashboard } from '../academics/VicePrincipalDashboard';
import { FinanceDashboard } from '../admin/FinanceDashboard';

// Academics
import { TeacherDashboard } from './TeacherDashboard';
import { HODDashboard } from '../academics/HODDashboard';
import { ExamCellDashboard } from '../academics/ExamCellDashboard';

// Operations
import { SecurityDashboard } from '../admin/SecurityDashboard';
import { EstateDashboard } from '../admin/EstateDashboard';
import { ReceptionDashboard } from '../admin/ReceptionDashboard';
import { InventoryDashboard } from '../inventory/InventoryDashboard';
import { InfirmaryDashboard } from '../health/InfirmaryDashboard';
import { AdmissionsDashboard } from '../admissions/AdmissionsDashboard';

// Facilities
import { BusFleet } from '../transport/BusFleet';
import { LibraryManagement } from '../library/LibraryManagement';
import { HostelWarden } from '../hostel/HostelWarden';

// Users
import { ParentDashboard } from './ParentDashboard';

interface Props {
  role: UserRole;
  school: SchoolConfig;
  activeModule: string;
}

export const RoleBasedRouter: React.FC<Props> = ({ role, school, activeModule }) => {
  switch(role) {
    // Top Management
    case UserRole.SUPER_ADMIN:
    case UserRole.SCHOOL_ADMIN: return <StaffManagement />;
    case UserRole.PRINCIPAL: return <PrincipalDashboard activeModule={activeModule} />;
    case UserRole.VICE_PRINCIPAL: return <VicePrincipalDashboard />;
    case UserRole.FINANCE_MANAGER: return <FinanceDashboard school={school} activeModule={activeModule} />;
    
    // Academic Heads
    case UserRole.HOD: return <HODDashboard />;
    case UserRole.EXAM_CELL: return <ExamCellDashboard />;
    case UserRole.TEACHER: return <TeacherDashboard school={school} activeModule={activeModule} />;
    
    // Operations & Admin
    case UserRole.SECURITY_HEAD: return <SecurityDashboard />;
    case UserRole.ESTATE_MANAGER: return <EstateDashboard />;
    case UserRole.RECEPTIONIST: return <ReceptionDashboard />;
    case UserRole.ADMISSIONS_OFFICER: return <AdmissionsDashboard />;
    case UserRole.INVENTORY_MANAGER: return <InventoryDashboard />;
    case UserRole.NURSE: return <InfirmaryDashboard />;
    
    // Facilities
    case UserRole.FLEET_MANAGER: return <div className="p-6"><BusFleet /></div>;
    case UserRole.LIBRARIAN: return <div className="p-6"><LibraryManagement /></div>;
    case UserRole.WARDEN: return <div className="p-6"><HostelWarden /></div>;

    // End Users
    case UserRole.PARENT: 
    case UserRole.STUDENT:
        return <ParentDashboard school={school} activeModule={activeModule} />;
    
    // Fallback for unmapped roles
    default: return (
       <div className="flex items-center justify-center h-full text-red-500 font-bold">
         Configuration Error: Role {role} has no assigned dashboard.
       </div>
    );
  }
};
