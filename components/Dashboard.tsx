import React from 'react';
import { SchoolConfig } from '../types';
import { generateUPILink } from '../packages/api/src/upi-engine';
import { useAttendance } from '../packages/app/features/attendance/useAttendance';
import { BusFleet } from '../packages/app/features/transport/BusFleet';
import { LibraryManagement } from '../packages/app/features/library/LibraryManagement';
import { HostelWarden } from '../packages/app/features/hostel/HostelWarden';
import { useTranslation } from '../packages/app/provider/language-context';

interface Props {
  school: SchoolConfig;
  activeModule: string;
}

/**
 * Admin Dashboard
 * Full access to all modules: Finance, Transport, Hostel, Library.
 */
export const Dashboard: React.FC<Props> = ({ school, activeModule }) => {
  const { syncOfflineQueue } = useAttendance(school.school_id);
  const { t } = useTranslation();

  const sampleFeeLink = generateUPILink({
    payeeVPA: school.upi_vpa,
    payeeName: school.name,
    amount: 1500.00,
    transactionNote: "Term 1 Fees",
    transactionRef: "INV-DEMO"
  });

  const renderModule = () => {
    switch(activeModule) {
      case 'TRANSPORT': return <BusFleet />;
      case 'LIBRARY': return <LibraryManagement />;
      case 'HOSTEL': return <HostelWarden />;
      case 'FINANCE': return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
           <h2 className="text-xl font-bold mb-4 text-gray-800">Finance & Collections</h2>
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
      );
      default: return ( // DASHBOARD / OVERVIEW
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t('sync_status')}</h3>
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-sm text-gray-600">System Operational</span>
              </div>
              <button 
                onClick={() => syncOfflineQueue()}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
              >
                Force Sync Data
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-2">School Health</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                 <div className="p-2">
                   <p className="text-2xl font-bold text-gray-900">92%</p>
                   <p className="text-xs text-gray-500">Attendance</p>
                 </div>
                 <div className="p-2 border-l">
                   <p className="text-2xl font-bold text-gray-900">8/10</p>
                   <p className="text-xs text-gray-500">Buses On Time</p>
                 </div>
                 <div className="p-2 border-l">
                   <p className="text-2xl font-bold text-gray-900">0</p>
                   <p className="text-xs text-gray-500">Critical Alerts</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 capitalize">
        {activeModule === 'DASHBOARD' ? 'School Overview' : activeModule.toLowerCase()}
      </h1>
      {renderModule()}
    </div>
  );
};
