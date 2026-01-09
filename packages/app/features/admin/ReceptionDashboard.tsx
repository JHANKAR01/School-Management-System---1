
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignTable, PageHeader, SovereignButton, SovereignInput, SovereignBadge } from '../../components/SovereignComponents';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';

export const ReceptionDashboard = () => {
  const queryClient = useQueryClient();
  const [visitor, setVisitor] = useState({ name: '', purpose: '' });

  const { data: visitors } = useQuery({
    queryKey: ['visitors'],
    queryFn: async () => {
      // const res = await fetch('/api/operations/visitors', ...);
      // return res.json();
      return SOVEREIGN_GENESIS_DATA.visitors;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      // await fetch('/api/operations/visitors', ...);
      console.log("[DEMO] Visitor Check-in:", data);
    },
    onSuccess: () => {
      alert("Visitor Checked In (Mock)");
      setVisitor({ name: '', purpose: '' });
    }
  });

  const columns = [
    { header: "Time", accessor: "time" },
    { header: "Visitor Name", accessor: "name" },
    { header: "Purpose", accessor: "purpose" },
    { header: "Status", accessor: (row: any) => <SovereignBadge status="neutral">{row.status}</SovereignBadge> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Front Desk" subtitle="Visitor Registry" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit space-y-4">
          <h3 className="font-bold">Register Visitor</h3>
          <SovereignInput label="Name" value={visitor.name} onChange={e => setVisitor({...visitor, name: e.target.value})} />
          <SovereignInput label="Purpose" value={visitor.purpose} onChange={e => setVisitor({...visitor, purpose: e.target.value})} />
          <SovereignButton onClick={() => addMutation.mutate({...visitor, time: new Date().toLocaleTimeString()})} className="w-full">Check In</SovereignButton>
        </div>
        <div className="lg:col-span-2">
          <SovereignTable data={visitors || []} columns={columns} />
        </div>
      </div>
    </div>
  );
};
