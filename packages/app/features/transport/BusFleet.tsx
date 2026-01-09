
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignTable, SovereignBadge } from '../../components/SovereignComponents';

export const BusFleet = () => {
  const queryClient = useQueryClient();
  
  const { data: buses } = useQuery({
    queryKey: ['buses'],
    queryFn: async () => {
      const res = await fetch('/api/logistics/buses', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json();
    }
  });

  const assignMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/logistics/assign-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ studentId: 's1', routeId: 'r1' })
      });
      return res.json();
    },
    onSuccess: () => alert("Route Assigned & Invoice Generated!")
  });

  const columns = [
    { header: "Bus No", accessor: "number" },
    { header: "Route", accessor: "route" },
    { header: "Driver", accessor: "driver" },
    { header: "Capacity", accessor: (row: any) => `${row.occupied}/${row.capacity}` },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'ON_ROUTE' ? 'success' : 'neutral'}>{row.status.replace('_', ' ')}</SovereignBadge> }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Fleet Management</h2>
      <div className="mb-6">
         <SovereignTable data={buses || []} columns={columns} />
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-md">
        <p className="mb-4 font-bold text-gray-700">Quick Actions</p>
        <SovereignButton onClick={() => assignMutation.mutate()} isLoading={assignMutation.isPending}>
          Assign Route R1 to Student S1 (Demo)
        </SovereignButton>
      </div>
    </div>
  );
};
