
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SovereignTable, PageHeader, SovereignBadge } from '../../components/SovereignComponents';
import { useInteraction } from '../../provider/InteractionContext';

export const HODDashboard = () => {
  const { syllabus, approveSyllabus } = useInteraction();

  const columns = [
    { header: "Teacher", accessor: "teacher" },
    { header: "Class", accessor: "class" },
    { header: "Subject", accessor: "subject" },
    { header: "Progress", accessor: (row: any) => (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${row.completed}%` }}></div>
        </div>
        <span className="text-xs font-bold">{row.completed}%</span>
      </div>
    )},
    { header: "Status", accessor: (row: any) => (
      <SovereignBadge status={row.status === 'ON_TRACK' || row.status === 'COMPLETED' ? 'success' : 'warning'}>{row.status.replace('_', ' ')}</SovereignBadge>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Department Head" subtitle="Syllabus & Lesson Plan Oversight" />
      <SovereignTable 
        data={syllabus} 
        columns={columns} 
        actions={(row) => row.status !== 'COMPLETED' ? (
            <button 
                onClick={() => approveSyllabus(row.id)}
                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold hover:bg-indigo-100"
            >
                Approve
            </button>
        ) : null}
      />
    </div>
  );
};
