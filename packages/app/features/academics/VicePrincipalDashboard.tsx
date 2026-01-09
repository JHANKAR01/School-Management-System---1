
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SovereignTable, PageHeader, StatCard, SovereignBadge } from '../../components/SovereignComponents';
import { Calendar, Users, AlertTriangle } from 'lucide-react';

export const VicePrincipalDashboard = () => {
  const { data: substitutions, isLoading } = useQuery({
    queryKey: ['substitutions'],
    queryFn: async () => {
      const res = await fetch('/api/academics/substitutions', { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
      });
      return res.json();
    }
  });

  const columns = [
    { header: "Period", accessor: "period" },
    { header: "Class", accessor: "class" },
    { header: "Subject", accessor: "subject" },
    { header: "Absent Teacher", accessor: "absentTeacher" },
    { header: "Assigned To", accessor: (row: any) => <span className="font-bold text-indigo-600">{row.assignedTo}</span> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Vice Principal Operations" subtitle="Daily Academic Logistics" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Staff on Leave" value="4" icon={<Users className="w-5 h-5"/>} trend={{ value: 2, isPositive: false }} />
        <StatCard title="Free Periods" value="12" icon={<Calendar className="w-5 h-5"/>} subtitle="Available for Sub" />
        <StatCard title="Critical Gaps" value="0" icon={<AlertTriangle className="w-5 h-5"/>} subtitle="All classes covered" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Today's Substitution Plan</h2>
          <SovereignBadge status="success">Auto-Generated</SovereignBadge>
        </div>
        {isLoading ? <div className="p-8 text-center">Loading Schedules...</div> : 
          <SovereignTable data={substitutions || []} columns={columns} />
        }
      </div>
    </div>
  );
};
