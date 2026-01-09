
import React from 'react';
import { SchoolConfig } from '../types';
import { generateUPILink } from '../packages/api/src/upi-engine';
import { useAttendance } from '../packages/app/features/attendance/useAttendance';
import { BusFleet } from '../packages/app/features/transport/BusFleet';
import { LibraryManagement } from '../packages/app/features/library/LibraryManagement';
import { HostelWarden } from '../packages/app/features/hostel/HostelWarden';
import { useTranslation } from '../packages/app/provider/language-context';
import { useLowDataMode } from '../packages/app/hooks/useLowDataMode';
import { 
  StatCard, 
  SovereignButton, 
  PageHeader, 
  SovereignTable 
} from '../packages/app/components/SovereignComponents';
import { 
  Wallet, 
  Users, 
  Bus as BusIcon, 
  Activity, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

interface Props {
  school: SchoolConfig;
  activeModule: string;
}

const MOCK_AUDIT_LOGS = [
  { id: 1, action: 'FEE_PAYMENT', details: 'Aarav Kumar paid Term 1 Fees', time: '10:45 AM', user: 'Parent' },
  { id: 2, action: 'BUS_DELAY', details: 'Route 1A delayed by 15 mins', time: '10:30 AM', user: 'Fleet Mgr' },
  { id: 3, action: 'LIB_FINE', details: 'Book "Clean Code" returned overdue', time: '09:15 AM', user: 'Librarian' },
];

export const Dashboard: React.FC<Props> = ({ school, activeModule }) => {
  const { syncOfflineQueue } = useAttendance(school.school_id);
  const { t } = useTranslation();
  const { isLowData } = useLowDataMode();

  const sampleFeeLink = generateUPILink({
    payeeVPA: school.upi_vpa,
    payeeName: school.name,
    amount: 1500.00,
    transactionNote: "Term 1 Fees",
    transactionRef: "INV-DEMO"
  });

  // --- RENDER CONTENT MODULE ---
  const renderModule = () => {
    switch(activeModule) {
      case 'TRANSPORT': return <BusFleet />;
      case 'LIBRARY': return <LibraryManagement />;
      case 'HOSTEL': return <HostelWarden />;
      case 'FINANCE': return (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                title="Total Collected" 
                value="₹45,200" 
                trend={{ value: 12, isPositive: true }}
                icon={<Wallet className="w-5 h-5" />}
                subtitle="Today's Revenue"
              />
              <StatCard 
                title="Pending Invoices" 
                value="12" 
                trend={{ value: 5, isPositive: false }}
                icon={<AlertCircle className="w-5 h-5" />}
                subtitle="Needs Follow-up"
              />
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Quick Action: Direct UPI Link</h3>
              <div className="flex items-center gap-4">
                <code className="flex-1 p-3 bg-gray-50 rounded border border-gray-200 font-mono text-xs break-all">
                  {sampleFeeLink}
                </code>
                <SovereignButton variant="secondary" onClick={() => navigator.clipboard.writeText(sampleFeeLink)}>
                  Copy
                </SovereignButton>
              </div>
           </div>
        </div>
      );
      default: return (
        // --- OVERVIEW / COMMAND CENTER ---
        <div className="space-y-6">
          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Attendance" 
              value="92%" 
              trend={{ value: 2.1, isPositive: true }}
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard 
              title="Revenue (Mtd)" 
              value="₹4.2L" 
              trend={{ value: 8.5, isPositive: true }}
              icon={<Wallet className="w-5 h-5" />}
            />
            <StatCard 
              title="Active Fleet" 
              value="8/10" 
              subtitle="2 Buses in Maintenance"
              icon={<BusIcon className="w-5 h-5" />}
            />
            <StatCard 
              title="System Health" 
              value="100%" 
              icon={<Activity className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* MAIN CHART / WIDGET AREA (2/3 width) */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">Enrollment Trends</h3>
                  <select className="text-sm border-gray-300 rounded-md">
                    <option>This Year</option>
                  </select>
                </div>
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                  <p className="text-gray-400 text-sm">Chart Visualization Placeholder</p>
                </div>
             </div>

             {/* ACTIVITY FEED (1/3 width) */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 text-sm">Live Activity Feed</h3>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                  {MOCK_AUDIT_LOGS.map(log => (
                    <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                         <p className="text-xs font-bold text-gray-900">{log.action.replace('_', ' ')}</p>
                         <span className="text-[10px] text-gray-400">{log.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                        User: <span className="font-medium text-gray-700">{log.user}</span>
                      </p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader 
        title={activeModule === 'DASHBOARD' ? 'Control Tower' : t(activeModule.toLowerCase())}
        subtitle={`Welcome back to ${school.name}`}
        action={
          <SovereignButton variant="secondary" onClick={() => syncOfflineQueue()} icon={<RefreshCw className="w-4 h-4" />}>
            Force Sync Data
          </SovereignButton>
        }
      />
      {renderModule()}
    </div>
  );
};
