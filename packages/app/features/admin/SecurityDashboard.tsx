
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SovereignTable, PageHeader, SovereignButton, SovereignBadge } from '../../components/SovereignComponents';
import { ShieldAlert } from 'lucide-react';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';

export const SecurityDashboard = () => {
  const { data: logs } = useQuery({
    queryKey: ['gate-logs'],
    queryFn: async () => {
      // const res = await fetch('/api/operations/gate-logs', ...);
      // return res.json();
      return SOVEREIGN_GENESIS_DATA.gateLogs;
    }
  });

  const alertMutation = useMutation({
    mutationFn: async () => {
      // await fetch('/api/operations/broadcast-alert', ...);
      console.log("[DEMO] LOCKDOWN TRIGGERED");
    },
    onSuccess: () => alert("Emergency Broadcast Sent to All Staff (Demo)")
  });

  const columns = [
    { header: "Time", accessor: "time" },
    { header: "Type", accessor: "type" },
    { header: "Name", accessor: "name" },
    { header: "Purpose", accessor: "purpose" },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'INSIDE' ? 'warning' : 'neutral'}>{row.status}</SovereignBadge> }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Gate Command" subtitle="Live Entry/Exit Logs" />
        <SovereignButton variant="danger" icon={<ShieldAlert className="w-4 h-4"/>} onClick={() => { if(confirm("TRIGGER LOCKDOWN?")) alertMutation.mutate() }}>
          EMERGENCY LOCKDOWN
        </SovereignButton>
      </div>
      <SovereignTable data={logs || []} columns={columns} />
    </div>
  );
};
