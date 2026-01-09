import React from 'react';

const MEDICAL_LOGS = [
  { id: 1, time: '09:30 AM', student: 'Rohan Gupta (5-A)', issue: 'Fever (101°F)', action: 'Paracetamol given, Parents called' },
  { id: 2, time: '11:15 AM', student: 'Sneha Patil (8-B)', issue: 'Minor Cut (Playground)', action: 'Dressed & Bandaged' },
];

export const InfirmaryDashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Infirmary & Health Logs</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
          + Log Visit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-700">Today's Visits</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {MEDICAL_LOGS.map(log => (
            <div key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{log.student}</p>
                  <p className="text-sm text-red-600 font-medium mt-1">Diagnosis: {log.issue}</p>
                  <p className="text-xs text-gray-500 mt-1">Action: {log.action}</p>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-gray-700 mb-4">Vaccination Drive Tracker</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
           <p className="text-gray-500">Upcoming Camp: <strong>Rubella Vaccination</strong> (Next Tuesday)</p>
           <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
           </div>
           <p className="text-xs text-gray-400 mt-2">45% Consent Forms Received</p>
        </div>
      </div>
    </div>
  );
};
