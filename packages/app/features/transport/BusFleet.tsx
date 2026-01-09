
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SovereignButton, SovereignTable } from '../../components/SovereignComponents';

export const BusFleet = () => {
  const assignMutation = useMutation({
    mutationFn: async () => {
      // Hardcoded for demo: assigning student s1 to route r1
      const res = await fetch('/api/logistics/assign-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ studentId: 's1', routeId: 'r1' })
      });
      return res.json();
    },
    onSuccess: () => alert("Route Assigned & Invoice Generated!")
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Fleet & Logistics</h2>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <p className="mb-4">Demo Action: Assign Student to Route</p>
        <SovereignButton onClick={() => assignMutation.mutate()} isLoading={assignMutation.isPending}>
          Assign Route R1 to Student S1
        </SovereignButton>
        <p className="text-xs text-gray-500 mt-2">This will verify RLS and insert an Invoice record.</p>
      </div>
    </div>
  );
};
