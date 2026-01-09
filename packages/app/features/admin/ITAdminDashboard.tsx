
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatCard, PageHeader, SovereignBadge } from '../../components/SovereignComponents';
import { Server, Wifi, Database, Fingerprint } from 'lucide-react';

export const ITAdminDashboard = () => {
  const { data: health } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await fetch('/api/health', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json(); // { status: 'OK', uptime: 1234 }
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="System Administration" subtitle="Infrastructure & Device Health" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <StatCard title="API Status" value={health?.status || 'Unknown'} icon={<Server className="w-5 h-5 text-green-600"/>} />
         <StatCard title="Uptime" value={`${Math.floor((health?.uptime || 0)/60)}m`} icon={<ClockIcon />} />
         <StatCard title="Database" value="Connected" icon={<Database className="w-5 h-5"/>} />
         <StatCard title="Latency" value="24ms" icon={<Wifi className="w-5 h-5"/>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
           <h3 className="font-bold mb-4 flex items-center gap-2">
             <Fingerprint className="w-5 h-5" /> Biometric Agents
           </h3>
           <div className="space-y-3">
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
               <span>Main Gate (Entry)</span>
               <SovereignBadge status="success">Online</SovereignBadge>
             </div>
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
               <span>Staff Room (Bio-1)</span>
               <SovereignBadge status="success">Online</SovereignBadge>
             </div>
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
               <span>Library (Bio-2)</span>
               <SovereignBadge status="error">Offline</SovereignBadge>
             </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
           <h3 className="font-bold mb-4">Storage Quota</h3>
           <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>Database (PostgreSQL)</span>
                 <span>45%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{width: '45%'}}></div></div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>Backups (S3)</span>
                 <span>12%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{width: '12%'}}></div></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
