import React, { useState } from 'react';
import { SovereignTable, PageHeader, SovereignBadge, SovereignButton, SovereignInput, StatCard } from '../../components/SovereignComponents';
import { useInteraction } from '../../provider/InteractionContext';
import { ActionModal } from '../../components/ActionModal';
import { Users, BookOpen, AlertCircle } from 'lucide-react';

export const HODDashboard = () => {
  const { syllabus, approveSyllabus } = useInteraction();
  const [activeTab, setActiveTab] = useState<'SYLLABUS' | 'SUBSTITUTION'>('SYLLABUS');
  
  // Local state for substitution modal
  const [isSubModalOpen, setSubModalOpen] = useState(false);
  const [subForm, setSubForm] = useState({ absentTeacher: '', replacement: '', class: '', period: '' });

  const handleAssignSub = () => {
    // In a real app, this would push to a Substitution Context/DB
    if (!subForm.absentTeacher || !subForm.replacement) {
      alert("Please select both teachers.");
      return;
    }
    alert(`Substitution Assigned: ${subForm.replacement} taking ${subForm.class} (Period ${subForm.period}) in place of ${subForm.absentTeacher}`);
    setSubModalOpen(false);
    setSubForm({ absentTeacher: '', replacement: '', class: '', period: '' });
  };

  const syllabusColumns = [
    { header: "Teacher", accessor: "teacher" },
    { header: "Class", accessor: "class" },
    { header: "Subject", accessor: "subject" },
    { header: "Progress", accessor: (row: any) => (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${row.completed}%` }}></div>
        </div>
        <span className="text-xs font-bold">{row.completed}%</span>
      </div>
    )},
    { header: "Status", accessor: (row: any) => (
      <SovereignBadge status={row.status === 'ON_TRACK' || row.status === 'COMPLETED' ? 'success' : 'warning'}>{row.status.replace('_', ' ')}</SovereignBadge>
    )}
  ];

  // Mock Substitution Data for the list view
  const subData = [
    { id: 1, absent: 'Mrs. R. Iyer', class: 'X-A', period: '3rd', status: 'PENDING' },
    { id: 2, absent: 'Mr. P. Singh', class: 'IX-B', period: '5th', status: 'ASSIGNED' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Department Head" subtitle="Academics & Operations" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Syllabus Comp." value="68%" subtitle="Department Average" icon={<BookOpen className="w-5 h-5"/>} />
        <StatCard title="Active Staff" value="12/14" subtitle="2 on Leave" icon={<Users className="w-5 h-5"/>} />
        <StatCard title="Open Subs" value="1" subtitle="Requires Action" icon={<AlertCircle className="w-5 h-5 text-red-500"/>} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('SYLLABUS')} 
          className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'SYLLABUS' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Syllabus Review
        </button>
        <button 
          onClick={() => setActiveTab('SUBSTITUTION')} 
          className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'SUBSTITUTION' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Substitution
        </button>
      </div>

      {activeTab === 'SYLLABUS' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <SovereignTable 
            data={syllabus} 
            columns={syllabusColumns} 
            actions={(row) => row.status !== 'COMPLETED' ? (
                <button 
                    onClick={() => approveSyllabus(row.id)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 border border-indigo-100 transition-colors"
                >
                    Approve Plan
                </button>
            ) : <span className="text-xs font-bold text-green-600">✓ Verified</span>}
            />
        </div>
      )}

      {activeTab === 'SUBSTITUTION' && (
        <div className="space-y-4">
           <div className="flex justify-end">
             <SovereignButton onClick={() => setSubModalOpen(true)}>+ Assign Substitute</SovereignButton>
           </div>
           <div className="bg-white rounded-xl shadow-sm border border-gray-200">
               <SovereignTable
                data={subData}
                columns={[
                { header: "Absent Teacher", accessor: "absent" },
                { header: "Class", accessor: "class" },
                { header: "Period", accessor: "period" },
                { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'ASSIGNED' ? 'success' : 'error'}>{row.status}</SovereignBadge> }
                ]}
               />
           </div>
        </div>
      )}

      {/* Substitution Modal */}
      <ActionModal
        isOpen={isSubModalOpen}
        onClose={() => setSubModalOpen(false)}
        title="Assign Substitution"
        footer={
          <>
            <SovereignButton variant="ghost" onClick={() => setSubModalOpen(false)}>Cancel</SovereignButton>
            <SovereignButton onClick={handleAssignSub}>Confirm Assignment</SovereignButton>
          </>
        }
      >
        <div className="space-y-4">
           <SovereignInput label="Absent Teacher" value={subForm.absentTeacher} onChange={e => setSubForm({...subForm, absentTeacher: e.target.value})} placeholder="e.g. Mrs. R. Iyer" />
           <div className="grid grid-cols-2 gap-4">
              <SovereignInput label="Class" value={subForm.class} onChange={e => setSubForm({...subForm, class: e.target.value})} />
              <SovereignInput label="Period" value={subForm.period} onChange={e => setSubForm({...subForm, period: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Replacement</label>
             <select 
               className="w-full border p-2 rounded bg-white" 
               value={subForm.replacement} 
               onChange={e => setSubForm({...subForm, replacement: e.target.value})}
             >
               <option value="">-- Select Free Teacher --</option>
               <option value="Mr. T. Das">Mr. T. Das (Free)</option>
               <option value="Ms. K. Sharma">Ms. K. Sharma (Library)</option>
             </select>
           </div>
        </div>
      </ActionModal>
    </div>
  );
};