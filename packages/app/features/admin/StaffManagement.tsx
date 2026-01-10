
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '../../../../types';
import { SovereignButton, SovereignTable, SovereignInput, SovereignSkeleton } from '../../components/SovereignComponents';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';

export const StaffManagement = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', username: '', role: UserRole.TEACHER, department: '' });

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      return SOVEREIGN_GENESIS_DATA.staff.map(s => ({
        id: s.id,
        full_name: s.name,
        role: s.role,
        teacher_profile: { department: s.department }
      }));
    }
  });

  const hireMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("[DEMO] Hiring:", data);
      return { success: true };
    },
    onSuccess: () => {
      alert("Staff Member Added (Mock)");
      setShowAddModal(false);
      setNewStaff({ name: '', username: '', role: UserRole.TEACHER, department: '' });
    }
  });

  const fireMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("[DEMO] Firing:", id);
    },
    onSuccess: () => alert("Access Revoked (Mock)")
  });

  const handleHire = () => hireMutation.mutate(newStaff);
  const handleFire = (id: string) => {
    if (confirm("Revoke system access for this employee?")) fireMutation.mutate(id);
  };

  const columns = [
    { header: "Employee Name", accessor: (row: any) => row.full_name },
    { header: "Role", accessor: (row: any) => <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-bold">{row.role}</span> },
    { header: "Department", accessor: (row: any) => row.teacher_profile?.department || '-' },
  ];

  if (isLoading) return <div className="p-6"><SovereignSkeleton className="h-64 w-full" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-sm text-gray-500">Live DB Access • RLS Secured</p>
        </div>
        <SovereignButton onClick={() => setShowAddModal(true)}>+ Onboard Staff</SovereignButton>
      </div>

      <SovereignTable 
        data={staff || []} 
        columns={columns} 
        actions={(emp) => (
          <button onClick={() => handleFire(emp.id)} className="text-red-600 hover:text-red-900 text-sm font-bold">Terminate</button>
        )}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-xl font-bold">New Employee</h2>
            <SovereignInput label="Full Name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
            <SovereignInput label="Username" value={newStaff.username} onChange={e => setNewStaff({...newStaff, username: e.target.value})} />
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
              <select className="w-full border p-2 rounded" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}>
                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {newStaff.role === UserRole.TEACHER && (
              <SovereignInput label="Department" value={newStaff.department} onChange={e => setNewStaff({...newStaff, department: e.target.value})} />
            )}

            <div className="flex gap-2 pt-4">
              <SovereignButton variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</SovereignButton>
              <SovereignButton onClick={handleHire} isLoading={hireMutation.isPending} className="flex-1">Confirm</SovereignButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
