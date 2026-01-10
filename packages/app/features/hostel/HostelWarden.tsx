
import React, { useState } from 'react';
import { useInteraction } from '../../provider/InteractionContext';
import { SovereignButton, SovereignBadge, PageHeader } from '../../components/SovereignComponents';
import { ActionModal } from '../../components/ActionModal';
import { Bed } from 'lucide-react';

export const HostelWarden = () => {
  const { hostelRooms, students, allocateRoom } = useInteraction();
  const [view, setView] = useState<'ALLOCATION' | 'ATTENDANCE'>('ALLOCATION');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [studentId, setStudentId] = useState('');

  const openAllocation = (roomId: string) => {
    setSelectedRoom(roomId);
    setModalOpen(true);
  };

  const handleAllocate = () => {
    if (selectedRoom && studentId) {
        allocateRoom(selectedRoom, studentId);
        setModalOpen(false);
        setStudentId('');
        setSelectedRoom(null);
    }
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden m-6 max-w-7xl mx-auto">
      <div className="p-6 pb-0">
          <PageHeader title="Hostel Management" subtitle="Room Allocation & Rolls" />
      </div>

      <div className="flex border-b border-gray-200 px-6">
        <button onClick={() => setView('ALLOCATION')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${view === 'ALLOCATION' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Room Allocation</button>
        <button onClick={() => setView('ATTENDANCE')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${view === 'ATTENDANCE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Night Roll Call</button>
      </div>

      <div className="p-6">
        {view === 'ALLOCATION' && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {hostelRooms.map((room) => (
              <div key={room.roomNumber} className="border rounded-lg p-4 bg-white relative">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Room {room.roomNumber}</h3>
                        <p className="text-xs text-gray-500">{room.gender === 'BOYS' ? 'Boys Wing' : 'Girls Wing'}</p>
                    </div>
                    <SovereignBadge status={room.occupied === room.capacity ? 'error' : 'success'}>
                        {room.occupied}/{room.capacity}
                    </SovereignBadge>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < room.occupied ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
                
                <div className="mb-4 min-h-[40px]">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Occupants</p>
                    <div className="flex flex-wrap gap-1">
                        {room.students.map(s => (
                            <span key={s} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600" title={getStudentName(s)}>
                                {getStudentName(s).split(' ')[0]}
                            </span>
                        ))}
                    </div>
                </div>

                <SovereignButton 
                  onClick={() => openAllocation(room.roomNumber)}
                  disabled={room.occupied === room.capacity}
                  variant="secondary"
                  className="w-full text-xs"
                >
                  {room.occupied === room.capacity ? 'Full' : '+ Allocate Bed'}
                </SovereignButton>
              </div>
            ))}
          </div>
        )}

        {view === 'ATTENDANCE' && (
           <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <Bed className="w-8 h-8 mx-auto mb-2 text-gray-400" />
             <p>Attendance Module Linked to Biometric Entry.</p>
             <p className="text-xs mt-1">Syncs automatically at 9:00 PM.</p>
           </div>
        )}
      </div>

      {/* Allocation Modal */}
      <ActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Allocate Bed: Room ${selectedRoom}`}
        onConfirm={handleAllocate}
        confirmLabel="Assign Room"
      >
         <div className="space-y-4">
            <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Student</label>
             <select 
               className="w-full border p-2 rounded bg-white"
               value={studentId}
               onChange={e => setStudentId(e.target.value)}
             >
                <option value="">Choose Student...</option>
                {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                ))}
             </select>
           </div>
         </div>
      </ActionModal>
    </div>
  );
};
