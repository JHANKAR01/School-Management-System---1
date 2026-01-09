
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, SovereignSkeleton } from '../../components/SovereignComponents';

export const InfirmaryDashboard = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['medical-logs'],
    queryFn: async () => {
      const res = await fetch('/api/health/logs', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json();
    }
  });

  if (isLoading) return <div className="p-6"><SovereignSkeleton className="h-64" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Infirmary & Health Logs" subtitle="Daily Medical Registry" />
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
          + Log Visit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-700">Recent Visits</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {logs?.map((log: any) => (
            <div key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{log.student}</p>
                  <p className="text-sm text-red-600 font-medium mt-1">Diagnosis: {log.issue}</p>
                  <p className="text-xs text-gray-500 mt-1">Action: {log.action}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded block mb-1">{log.time}</span>
                    <span className="text-[10px] text-gray-400">{log.date}</span>
                </div>
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
