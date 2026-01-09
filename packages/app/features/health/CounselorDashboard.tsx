
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SovereignTable, PageHeader, StatCard, SovereignBadge } from '../../components/SovereignComponents';
import { HeartPulse, Brain, UserPlus } from 'lucide-react';
import { SOVEREIGN_GENESIS_DATA } from '../../../../api/src/data/dummy-data';

interface CounselorNote {
  id: number | string;
  date: string;
  student: string;
  category: string;
  note: string;
}

export const CounselorDashboard = () => {
  const { data: notes } = useQuery<CounselorNote[]>({
    queryKey: ['counselor-notes'],
    queryFn: async () => {
      // const res = await fetch('/api/health/counselor/notes', ...);
      // return res.json();
      return SOVEREIGN_GENESIS_DATA.counseling;
    }
  });

  const columns: any[] = [
    { header: "Date", accessor: "date" },
    { header: "Student", accessor: "student" },
    { header: "Category", accessor: "category" },
    { header: "Notes", accessor: "note" },
    { header: "Severity", accessor: () => <SovereignBadge status="warning">Medium</SovereignBadge> }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Student Wellness" subtitle="Counseling & Behavioral Health" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatCard title="Active Cases" value="12" icon={<Brain className="w-5 h-5"/>} trend={{ value: 2, isPositive: false }} />
         <StatCard title="Sessions Today" value="5" icon={<UserPlus className="w-5 h-5"/>} />
         <StatCard title="Flagged (Severe)" value="1" icon={<HeartPulse className="w-5 h-5 text-red-600"/>} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between">
          <h3 className="font-bold text-gray-700">Private Session Logs</h3>
          <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded">+ New Session</button>
        </div>
        <SovereignTable data={notes || []} columns={columns} />
      </div>
    </div>
  );
};
