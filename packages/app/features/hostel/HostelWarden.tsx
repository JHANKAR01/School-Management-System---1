import React, { useState } from 'react';
import { HostelRoom } from '../../../../types';

const MOCK_ROOMS: HostelRoom[] = [
  { roomNumber: '101', capacity: 4, occupied: 3, gender: 'BOYS', students: ['s1', 's2', 's5'] },
  { roomNumber: '102', capacity: 4, occupied: 4, gender: 'BOYS', students: ['s6', 's7', 's8', 's9'] }, // Full
  { roomNumber: '103', capacity: 4, occupied: 0, gender: 'BOYS', students: [] },
];

export const HostelWarden = () => {
  const [rooms, setRooms] = useState<HostelRoom[]>(MOCK_ROOMS);
  const [view, setView] = useState<'ALLOCATION' | 'ATTENDANCE'>('ALLOCATION');

  const handleAllocate = (roomNum: string) => {
    const studentId = prompt("Enter Student ID to Allocate:");
    if (!studentId) return;

    setRooms(prev => prev.map(r => {
      if (r.roomNumber === roomNum && r.occupied < r.capacity) {
        // Trigger Billing
        console.log(`[Sovereign Hostel] Adding Hostel Fee (Fixed) + Mess Advance to Student ${studentId}`);
        return { ...r, occupied: r.occupied + 1, students: [...r.students, studentId] };
      }
      return r;
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setView('ALLOCATION')}
          className={`flex-1 py-3 text-sm font-bold ${view === 'ALLOCATION' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Room Allocation
        </button>
        <button 
          onClick={() => setView('ATTENDANCE')}
          className={`flex-1 py-3 text-sm font-bold ${view === 'ATTENDANCE' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          Night Roll Call (9PM)
        </button>
      </div>

      <div className="p-4">
        {view === 'ALLOCATION' && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {rooms.map(room => (
              <div key={room.roomNumber} className={`border rounded-lg p-4 text-center ${room.occupied === room.capacity ? 'bg-gray-100 opacity-75' : 'bg-white'}`}>
                <h3 className="text-lg font-bold text-gray-800">Room {room.roomNumber}</h3>
                <p className="text-xs text-gray-500 mb-2">{room.gender}</p>
                
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-6 rounded-sm ${i < room.occupied ? 'bg-indigo-600' : 'bg-gray-200'}`} 
                      title={i < room.occupied ? 'Occupied' : 'Empty'}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => handleAllocate(room.roomNumber)}
                  disabled={room.occupied === room.capacity}
                  className="w-full text-xs border border-gray-300 py-1 rounded hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  {room.occupied === room.capacity ? 'FULL' : '+ Allocate Bed'}
                </button>
              </div>
            ))}
          </div>
        )}

        {view === 'ATTENDANCE' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
              ⚠️ Please ensure physical verification of students before marking.
            </p>
            {rooms.flatMap(r => r.students).map(studentId => (
              <div key={studentId} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-bold text-gray-800">Student {studentId}</p>
                  <p className="text-xs text-gray-500">Room {rooms.find(r => r.students.includes(studentId))?.roomNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold hover:bg-green-200">P</button>
                  <button className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold hover:bg-red-200">A</button>
                </div>
              </div>
            ))}
            {rooms.flatMap(r => r.students).length === 0 && <p className="text-center text-gray-400">No students allocated yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
