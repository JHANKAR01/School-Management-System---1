
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignSkeleton } from '../../components/SovereignComponents';

export const HostelWarden = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'ALLOCATION' | 'ATTENDANCE'>('ALLOCATION');

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await fetch('/api/logistics/rooms', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      return res.json();
    }
  });

  const allocateMutation = useMutation({
    mutationFn: async ({ room, studentId }: { room: string, studentId: string }) => {
      await fetch('/api/logistics/allocate-room', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ roomId: room, studentId })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      alert("Allocated & Fee Generated");
    }
  });

  const handleAllocate = (roomId: string) => {
    const studentId = prompt("Enter Student ID to Allocate:");
    if (studentId) allocateMutation.mutate({ room: roomId, studentId });
  };

  if (isLoading) return <SovereignSkeleton className="h-64" />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setView('ALLOCATION')} className={`flex-1 py-3 text-sm font-bold ${view === 'ALLOCATION' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}>Room Allocation</button>
        <button onClick={() => setView('ATTENDANCE')} className={`flex-1 py-3 text-sm font-bold ${view === 'ATTENDANCE' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}>Night Roll Call</button>
      </div>

      <div className="p-6">
        {view === 'ALLOCATION' && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {rooms?.map((room: any) => (
              <div key={room.id} className="border rounded-lg p-4 text-center bg-white">
                <h3 className="text-lg font-bold text-gray-800">Room {room.number}</h3>
                <p className="text-xs text-gray-500 mb-2">{room.block}</p>
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <div key={i} className={`w-4 h-6 rounded-sm ${i < room.occupied ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <SovereignButton 
                  onClick={() => handleAllocate(room.id)}
                  disabled={room.occupied === room.capacity}
                  variant="secondary"
                  className="w-full text-xs"
                >
                  {room.occupied === room.capacity ? 'FULL' : '+ Allocate'}
                </SovereignButton>
              </div>
            ))}
          </div>
        )}

        {view === 'ATTENDANCE' && (
           <div className="p-8 text-center text-gray-500">
             Attendance Module Linked to Biometric Entry. Syncs automatically at 9 PM.
           </div>
        )}
      </div>
    </div>
  );
};
