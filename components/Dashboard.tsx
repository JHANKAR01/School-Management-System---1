import React from 'react';
import { SchoolConfig } from '../types';
import { generateUPILink } from '../packages/api/src/upi-engine';
import { useAttendance } from '../packages/app/features/attendance/useAttendance';

interface Props {
  school: SchoolConfig;
}

export const Dashboard: React.FC<Props> = ({ school }) => {
  const { syncOfflineQueue } = useAttendance(school.school_id);

  // Generate a sample UPI link for Fee Payment
  const sampleFeeLink = generateUPILink({
    payeeVPA: school.upi_vpa,
    payeeName: school.name,
    amount: 1500.00,
    transactionNote: "Term 1 Fees - Aarav",
    transactionRef: "INV-2023-001"
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fee Collection Card */}
        {school.features.fees && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Zero-Fee Fees</h3>
            <p className="text-sm text-gray-500 mb-4">Direct UPI collection without gateway fees.</p>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center">
              <p className="text-xs text-blue-800 mb-1">Generated Link Payload</p>
              <code className="text-[10px] break-all text-gray-600 block bg-white p-2 rounded border border-gray-200">
                {sampleFeeLink}
              </code>
            </div>
            
            <a 
              href={sampleFeeLink}
              className="mt-4 block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Pay ₹1500 via UPI
            </a>
          </div>
        )}

        {/* Sync Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Sync Status</h3>
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

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Today's Overview</h3>
          <div className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Attendance</span>
               <span className="font-bold text-gray-900">87%</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">Fees Collected</span>
               <span className="font-bold text-green-600">₹45,200</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};