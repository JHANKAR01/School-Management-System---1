
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SovereignTable, PageHeader, StatCard, SovereignBadge } from '../../components/SovereignComponents';
import { FileText, Lock, Printer } from 'lucide-react';

export const ExamCellDashboard = () => {
  const { data: papers } = useQuery({
    queryKey: ['papers'],
    queryFn: async () => {
      const res = await fetch('/api/academics/papers', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json();
    }
  });

  const columns = [
    { header: "Subject", accessor: "subject" },
    { header: "Class", accessor: "class" },
    { header: "Copies", accessor: "copies" },
    { header: "Secure Location", accessor: "location" },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'PRINTED' ? 'success' : 'warning'}>{row.status}</SovereignBadge> }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Exam Controller" subtitle="Confidential: Assessment Logistics" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatCard title="Upcoming Exams" value="5" icon={<FileText className="w-5 h-5"/>} />
         <StatCard title="Papers Printed" value="1,250" icon={<Printer className="w-5 h-5"/>} />
         <StatCard title="Strong Room" value="Locked" icon={<Lock className="w-5 h-5 text-green-600"/>} />
      </div>

      <SovereignTable data={papers || []} columns={columns} />
    </div>
  );
};
