
import React, { useState } from 'react';
import { SchoolConfig } from '../../../../types';
import { generateUPILink } from '../../../api/src/upi-engine';
import { StatCard, PageHeader, SovereignButton, SovereignTable, SovereignBadge } from '../../components/SovereignComponents';
import { Wallet, AlertCircle, TrendingUp, CheckCircle, Upload, FileText, Check } from 'lucide-react';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';
import { fuzzyMatch } from '../../../api/src/utils/finance-utils';

export const FinanceDashboard: React.FC<{ school: SchoolConfig, activeModule: string }> = ({ school, activeModule }) => {
  const [reconcileFile, setReconcileFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoices, setInvoices] = useState(SOVEREIGN_GENESIS_DATA.invoices);
  const [reconcileStats, setReconcileStats] = useState<{matched: number, total: number} | null>(null);

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
    { header: "UTR / Ref", accessor: (row: any) => <span className="font-mono text-xs">{row.utr || '-'}</span> },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'PAID' ? 'success' : 'warning'}>{row.status}</SovereignBadge> },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setReconcileFile(e.target.files[0]);
  };

  const runReconciliation = () => {
    if (!reconcileFile) return;
    setIsProcessing(true);

    // MOCK PARSING BANK STATEMENT
    // In a real app, we'd parse the CSV file. Here we simulate entries.
    const mockBankRows = [
        { utr: 'UPI123456789012', amount: 5000 }, // Perfect match for INV-001
        { utr: 'UPI987654321098', amount: 5000 }, // Perfect match for INV-005
        { utr: 'NEFT0987654321', amount: 2500 },  // Perfect match for INV-003
    ];

    setTimeout(() => {
      let matchCount = 0;
      const updatedInvoices = invoices.map(inv => {
          if (inv.status === 'PAID') return inv;

          // 1. Logic: Match by UTR
          const exactMatch = mockBankRows.find(row => row.utr === inv.utr && row.amount === inv.amount);
          
          if (exactMatch) {
              matchCount++;
              return { ...inv, status: 'PAID' };
          }
          return inv;
      });

      // @ts-ignore
      setInvoices(updatedInvoices);
      setReconcileStats({ matched: matchCount, total: mockBankRows.length });
      setIsProcessing(false);
      setReconcileFile(null);
    }, 1500);
  };

  const handleBatchGenerate = () => {
    const confirm = window.confirm("Generate Term 2 Invoices for 1,240 students? (Total ~₹24 Lakhs)");
    if(confirm) alert("Batch Job Queued. Parents will receive SMS links shortly.");
  };

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
          <div className="flex justify-end">
            <SovereignButton onClick={handleBatchGenerate} icon={<FileText className="w-4 h-4"/>}>
              Batch Generate Invoices
            </SovereignButton>
          </div>

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
             <SovereignTable data={invoices} columns={columns} />
          </div>
        </div>
      )}
      {activeModule === 'RECONCILIATION' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏦</div>
          <h2 className="text-xl font-bold text-gray-800">Bank Reconciliation</h2>
          <p className="text-gray-500 mt-2 mb-6">Upload Bank CSV Statement to match UTRs automatically.</p>
          
          <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50">
             <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="bank-csv" />
             <label htmlFor="bank-csv" className="cursor-pointer block">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <span className="text-indigo-600 font-bold hover:underline">{reconcileFile ? reconcileFile.name : "Select CSV File"}</span>
                <p className="text-xs text-gray-400 mt-1">Supports SBI, HDFC, ICICI formats</p>
             </label>
          </div>

          {reconcileFile && !reconcileStats && (
            <SovereignButton onClick={runReconciliation} isLoading={isProcessing} className="mt-6">
               Run Reconciliation Engine
            </SovereignButton>
          )}

          {reconcileStats && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
               <div className="flex items-center justify-center gap-2 text-green-800 font-bold text-lg">
                  <Check className="w-6 h-6" />
                  Processed Successfully
               </div>
               <p className="text-sm text-green-700 mt-1">
                 Matched {reconcileStats.matched} out of {reconcileStats.total} transactions.
               </p>
               <SovereignButton variant="ghost" onClick={() => setReconcileStats(null)} className="mt-2 text-xs">
                 Reset
               </SovereignButton>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200 inline-block">
            <strong>Engine Status:</strong> Fuzzy Logic enabled (Levenshtein Dist &le; 5).
          </div>
        </div>
      )}
    </div>
  );
};
