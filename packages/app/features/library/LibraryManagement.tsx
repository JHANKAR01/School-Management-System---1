
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignInput, SovereignTable, SovereignBadge } from '../../components/SovereignComponents';

export const LibraryManagement = () => {
  const [isbn, setIsbn] = useState('');
  const queryClient = useQueryClient();

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('/api/logistics/books', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json();
    }
  });
  
  const returnMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/logistics/return-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ isbn, studentId: 's1' })
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      if (data.fine > 0) alert(`Book Returned. Fine of ₹${data.fine} added to invoice.`);
      else alert("Book Returned. No fine.");
    }
  });

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "ISBN", accessor: "isbn" },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'AVAILABLE' ? 'success' : 'warning'}>{row.status}</SovereignBadge> }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h3 className="font-bold mb-4">Return Processor</h3>
          <SovereignInput label="Scan ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
          <div className="mt-4">
            <SovereignButton onClick={() => returnMutation.mutate()} isLoading={returnMutation.isPending} className="w-full">
              Process Return
            </SovereignButton>
          </div>
        </div>
        <div className="lg:col-span-2">
           <SovereignTable data={books || []} columns={columns} />
        </div>
      </div>
    </div>
  );
};
