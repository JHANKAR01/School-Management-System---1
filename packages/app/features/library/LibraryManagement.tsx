
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignInput, SovereignTable, SovereignBadge } from '../../components/SovereignComponents';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';

export const LibraryManagement = () => {
  const [isbn, setIsbn] = useState('');
  const queryClient = useQueryClient();

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      return SOVEREIGN_GENESIS_DATA.books;
    }
  });
  
  const returnMutation = useMutation({
    mutationFn: async () => {
      console.log("[DEMO] Returning Book ISBN:", isbn);
      return { fine: 0 };
    },
    onSuccess: (data) => {
      alert("Book Returned. No fine (Mock).");
      setIsbn('');
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
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit space-y-4">
          <h3 className="font-bold">Return Processor</h3>
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
