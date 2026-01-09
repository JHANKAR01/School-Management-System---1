
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SovereignButton, SovereignInput } from '../../components/SovereignComponents';

export const LibraryManagement = () => {
  const [isbn, setIsbn] = useState('');
  
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
      if (data.fine > 0) alert(`Book Returned. Fine of ₹${data.fine} added to invoice.`);
      else alert("Book Returned. No fine.");
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Circulation Desk</h2>
      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-md">
        <SovereignInput label="Scan ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
        <div className="mt-4">
          <SovereignButton onClick={() => returnMutation.mutate()} isLoading={returnMutation.isPending}>
            Process Return
          </SovereignButton>
        </div>
      </div>
    </div>
  );
};
