
import React from 'react';
import { SchoolConfig } from '../../../../types';
import { generateUPILink } from '../../../api/src/upi-engine';
import { StatCard, PageHeader, SovereignButton, SovereignTable, SovereignBadge } from '../../components/SovereignComponents';
import { Wallet, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';

export const FinanceDashboard: React.FC<{ school: SchoolConfig, activeModule: string }> = ({ school, activeModule }) => {
  const sampleFeeLink = generateUPILink({
    payeeVPA: school.upi_vpa,
    payeeName: school.name,
    amount: 1500.00,
    transactionNote: "Term 1 Fees",
    transactionRef: "INV-DEMO"
  });

  const columns = [
    { header: "Inv ID", accessor: "id" },
    { header: "Student", accessor: "studentId" },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: (row: any) => `₹${row.amount}` },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'PAID' ? 'success' : 'warning'}>{row.status}</SovereignBadge> },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Finance Department" subtitle="Ledger & Collection Management" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title="Total Collected" value="₹45.2L" trend={{ value: 12, isPositive: true }} icon={<Wallet className="w-5 h-5" />} />
         <StatCard title="Pending Dues" value="₹8.4L" trend={{ value: 5, isPositive: false }} icon={<AlertCircle className="w-5 h-5" />} />
         <StatCard title="Expenses" value="₹12.1L" icon={<TrendingUp className="w-5 h-5" />} subtitle="This Month" />
         <StatCard title="Cash on Hand" value="₹3.2L" icon={<CheckCircle className="w-5 h-5" />} />
      </div>

      {activeModule === 'COLLECTIONS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold text-gray-800 mb-4">Fee Tools</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-bold text-gray-700 uppercase">Direct UPI Link</h3>
                  <code className="block mt-1 text-xs text-gray-500 font-mono break-all">{sampleFeeLink}</code>
                  <SovereignButton variant="secondary" onClick={() => navigator.clipboard.writeText(sampleFeeLink)} className="mt-2 w-full">Copy Link</SovereignButton>
               </div>
               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <h3 className="text-sm font-bold text-indigo-900 uppercase">Sibling Discount Engine</h3>
                  <p className="text-xs text-indigo-700 mt-1">Auto-applies 10% waiver for younger siblings.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-green-700">Active</span>
                  </div>
               </div>
             </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h3 className="font-bold text-gray-700">Recent Invoices</h3>
             </div>
             <SovereignTable data={SOVEREIGN_GENESIS_DATA.invoices || []} columns={columns} />
          </div>
        </div>
      )}
      {activeModule === 'RECONCILIATION' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏦</div>
          <h2 className="text-xl font-bold text-gray-800">Bank Reconciliation</h2>
          <p className="text-gray-500 mt-2">Upload Bank CSV Statement here to match UTRs.</p>
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200 inline-block">
            <strong>Feature Active:</strong> Fuzzy Logic matching enabled (Levenshtein Distance &le; 5).
          </div>
        </div>
      )}
    </div>
  );
};
