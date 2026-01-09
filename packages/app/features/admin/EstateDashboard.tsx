
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignTable, PageHeader, SovereignBadge } from '../../components/SovereignComponents';

export const EstateDashboard = () => {
  const queryClient = useQueryClient();
  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await fetch('/api/operations/tickets', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json();
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch('/api/operations/tickets/resolve', { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ id })
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] })
  });

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Location", accessor: "location" },
    { header: "Issue", accessor: "issue" },
    { header: "Priority", accessor: (row: any) => <span className={`font-bold ${row.priority === 'CRITICAL' ? 'text-red-600' : 'text-gray-600'}`}>{row.priority}</span> },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'OPEN' ? 'error' : 'success'}>{row.status}</SovereignBadge> },
  ];

  const actions = (row: any) => row.status !== 'RESOLVED' ? (
    <button onClick={() => resolveMutation.mutate(row.id)} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">Fix</button>
  ) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Facility Management" subtitle="Maintenance Tickets" />
      <SovereignTable data={tickets || []} columns={columns} actions={actions} />
    </div>
  );
};
