
import React from 'react';
import { PageHeader, StatCard } from '../../components/SovereignComponents';
import { Gradebook } from './Gradebook';
import { Users, CheckCircle, Wallet } from 'lucide-react';

export const PrincipalDashboard: React.FC<{ activeModule: string }> = ({ activeModule }) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Principal's Office" subtitle="Academic Overview & Analytics" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title="Total Students" value="1,240" trend={{ value: 2, isPositive: true }} icon={<Users className="w-5 h-5" />} />
         <StatCard title="Avg Attendance" value="94%" trend={{ value: 1.5, isPositive: true }} icon={<CheckCircle className="w-5 h-5" />} />
         <StatCard title="Staff Present" value="48/50" icon={<Users className="w-5 h-5" />} subtitle="2 on Leave" />
         <StatCard title="Term Revenue" value="92%" icon={<Wallet className="w-5 h-5" />} subtitle="Collection Rate" />
      </div>

      {activeModule === 'RESULTS' && <Gradebook />}
      {activeModule === 'OVERVIEW' && (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center text-gray-500">
          <h3 className="font-bold text-lg mb-2">School Performance Index</h3>
          <p>Academic Year 2024-25</p>
        </div>
      )}
    </div>
  );
};
