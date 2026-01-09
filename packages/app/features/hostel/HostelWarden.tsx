
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SovereignButton, SovereignBadge } from '../../components/SovereignComponents';

// Localized Mock Data (simulating initial DB state)
const INITIAL_ROOMS = [
  { roomNumber: '101', capacity: 4, occupied: 3, gender: 'BOYS', students: ['s1', 's2', 's5'] },
  { roomNumber: '102', capacity: 4, occupied: 4, gender: 'BOYS', students: ['s6', 's7', 's8', 's9'] }, 
  { roomNumber: '103', capacity: 4, occupied: 0, gender: 'BOYS', students: [] },
];

export const HostelWarden = () => {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [view, setView] = useState<'ALLOCATION' | 'ATTENDANCE'>('ALLOCATION');

  const allocateMutation = useMutation({
    mutationFn: async ({ room, studentId }: { room: string, studentId: string }) => {
      // Call Real API
      await fetch('/api/logistics/allocate-room', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ roomId: room, studentId })
      });
    },
    onSuccess: (_, vars) => {
      setRooms(prev => prev.map(r => r.roomNumber === vars.room 
        ? { ...r, occupied: r.occupied + 1, students: [...r.students, vars.studentId] }
        : r
      ));
      alert("Allocated & Fee Generated");
    }
  });

  const handleAllocate = (roomNum: string) => {
    const studentId = prompt("Enter Student ID to Allocate:");
    if (studentId) allocateMutation.mutate({ room: roomNum, studentId });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setView('ALLOCATION')} className={`flex-1 py-3 text-sm font-bold ${view === 'ALLOCATION' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}>Room Allocation</button>
        <button onClick={() => setView('ATTENDANCE')} className={`flex-1 py-3 text-sm font-bold ${view === 'ATTENDANCE' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}>Night Roll Call</button>
      </div>

      <div className="p-6">
        {view === 'ALLOCATION' && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {rooms.map(room => (
              <div key={room.roomNumber} className="border rounded-lg p-4 text-center bg-white">
                <h3 className="text-lg font-bold text-gray-800">Room {room.roomNumber}</h3>
                <p className="text-xs text-gray-500 mb-2">{room.gender}</p>
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <div key={i} className={`w-4 h-6 rounded-sm ${i < room.occupied ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <SovereignButton 
                  onClick={() => handleAllocate(room.roomNumber)}
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
          <div className="space-y-2">
            {rooms.flatMap(r => r.students).map(sid => (
              <div key={sid} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                <span className="font-bold">Student {sid}</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 bg-green-200 rounded-full text-green-800 font-bold">P</button>
                  <button className="w-8 h-8 bg-red-200 rounded-full text-red-800 font-bold">A</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
