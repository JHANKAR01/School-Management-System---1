
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignTable, SovereignInput, SovereignBadge } from '../../components/SovereignComponents';

const MOCK_INQUIRIES = [
    { id: 1, parent_name: 'Mrs. Verma', phone: '9876543210', target_class: 'Class 5', status: 'NEW' },
    { id: 2, parent_name: 'Mr. Singh', phone: '9988776655', target_class: 'Class 8', status: 'FOLLOW_UP' },
];

export const AdmissionsDashboard = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ parentName: '', phone: '', class: '' });

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      // const res = await fetch('/api/admissions', ...);
      // return res.json();
      return MOCK_INQUIRIES;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      // await fetch('/api/admissions', ...);
      console.log("[DEMO] Log Inquiry:", data);
    },
    onSuccess: () => {
      alert("Inquiry Logged (Mock)");
      setForm({ parentName: '', phone: '', class: '' });
    }
  });

  const columns = [
    { header: "Parent Name", accessor: "parent_name" },
    { header: "Contact", accessor: "phone" },
    { header: "Class", accessor: "target_class" },
    { header: "Status", accessor: (row: any) => <SovereignBadge status="neutral">{row.status}</SovereignBadge> }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admissions CRM</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
          <h3 className="font-bold">New Inquiry</h3>
          <SovereignInput label="Parent Name" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} />
          <SovereignInput label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <SovereignInput label="Class" value={form.class} onChange={e => setForm({...form, class: e.target.value})} />
          <SovereignButton onClick={() => addMutation.mutate(form)} isLoading={addMutation.isPending} className="w-full">
            Log Inquiry
          </SovereignButton>
        </div>

        <div className="col-span-2">
          {isLoading ? <div>Loading CRM...</div> : <SovereignTable data={inquiries || []} columns={columns} />}
        </div>
      </div>
    </div>
  );
};
