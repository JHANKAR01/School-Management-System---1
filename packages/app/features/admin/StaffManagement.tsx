import React, { useState } from 'react';
import { UserRole } from '../../../../types';

// HR Data (Mock)
const MOCK_STAFF = [
  { id: 'emp_001', name: 'Mr. Rajesh Koothrappali', role: UserRole.PRINCIPAL, department: 'Admin' },
  { id: 'emp_002', name: 'Ms. Penny Hofstadter', role: UserRole.FINANCE_MANAGER, department: 'Finance' },
  { id: 'emp_003', name: 'Mr. Sheldon Cooper', role: UserRole.TEACHER, department: 'Science' },
  { id: 'emp_004', name: 'Mr. Leonard Hofstadter', role: UserRole.FLEET_MANAGER, department: 'Transport' },
];

export const StaffManagement = () => {
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: UserRole.TEACHER, department: '' });

  const handleHire = () => {
    const emp = {
      id: `emp_${Math.floor(Math.random() * 1000)}`,
      name: newStaff.name,
      role: newStaff.role,
      department: newStaff.department || 'General'
    };
    setStaff([...staff, emp]);
    setShowAddModal(false);
    setNewStaff({ name: '', role: UserRole.TEACHER, department: '' });
  };

  const handleFire = (id: string) => {
    if (confirm('Are you sure you want to terminate this employee? Access will be revoked immediately via RLS.')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources & Access Control</h1>
          <p className="text-sm text-gray-500">Manage Department Heads and Staff Permissions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          + Hire New Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role (System Access)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                      {emp.name[0]}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${emp.role === UserRole.PRINCIPAL ? 'bg-purple-100 text-purple-800' : 
                      emp.role === UserRole.FINANCE_MANAGER ? 'bg-green-100 text-green-800' :
                      emp.role === UserRole.FLEET_MANAGER ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {emp.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {emp.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleFire(emp.id)} className="text-red-600 hover:text-red-900">Terminate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Onboard New Staff</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
                  value={newStaff.role}
                  onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.PRINCIPAL}>Principal (Academic Head)</option>
                  <option value={UserRole.FINANCE_MANAGER}>Finance Manager</option>
                  <option value={UserRole.FLEET_MANAGER}>Fleet Manager</option>
                  <option value={UserRole.WARDEN}>Hostel Warden</option>
                  <option value={UserRole.LIBRARIAN}>Librarian</option>
                  <option value={UserRole.TEACHER}>Teacher</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g. Science, Transport, Accounts"
                  value={newStaff.department}
                  onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleHire}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700"
                >
                  Confirm & Grant Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
