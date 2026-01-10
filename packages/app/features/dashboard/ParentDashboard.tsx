
import React, { useState } from 'react';
import { SchoolConfig, UserRole } from '../../../../types';
import ParentPayments from '../../../../apps/expo/app/parent/payments';
import TransportTracking from '../../../../apps/expo/app/parent/transport';
import { Gradebook } from '../academics/Gradebook';
import { StatCard, PageHeader, SovereignButton, SovereignBadge, SovereignInput } from '../../components/SovereignComponents';
import { Wallet, Bus, FileText, CheckCircle, Bell, Video, Upload } from 'lucide-react';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';
import { useInteraction } from '../../provider/InteractionContext';
import { ActionModal } from '../../components/ActionModal';
import { generatePDFMarksheet } from '../../../api/src/services/pdf-service';

interface Props {
  school: SchoolConfig;
  activeModule: string;
  role?: UserRole;
}

export const ParentDashboard: React.FC<Props> = ({ school, activeModule, role }) => {
  // Mock logged in student as 'std_1' (Aarav Kumar)
  const student = SOVEREIGN_GENESIS_DATA.students.find(s => s.id === 'std_1');
  const invoices = SOVEREIGN_GENESIS_DATA.invoices.filter(inv => inv.studentId === 'std_1' && inv.status === 'PENDING');
  const totalDue = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Interaction Context
  const { liveClasses, homeworks, submitHomework } = useInteraction();
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedHw, setSelectedHw] = useState<string | null>(null);

  const activeLiveSubjects = Object.entries(liveClasses).filter(([_, isActive]) => isActive).map(([sub]) => sub);
  const isStudent = role === UserRole.STUDENT;

  const handleSubmitHw = () => {
    if(selectedHw) {
        submitHomework(selectedHw);
        setSubmissionModalOpen(false);
        setSelectedHw(null);
        alert("Assignment Submitted Successfully!");
    }
  };

  const downloadReportCard = async () => {
    if (!student) return;
    const url = await generatePDFMarksheet(student.id, "TERM_1_FINAL");
    if(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${student.name}_ReportCard.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  if (!student) return <div>Loading Profile...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      
      {/* LIVE CLASS BANNER (Student Only) */}
      {isStudent && activeLiveSubjects.length > 0 && (
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                      <Video className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg">Live Class in Session</h3>
                      <p className="text-sm opacity-90">{activeLiveSubjects.join(', ')} is live now.</p>
                  </div>
              </div>
              <SovereignButton 
                 className="bg-white text-red-600 border-none hover:bg-gray-100"
                 onClick={() => window.open('https://meet.jit.si/sovereign-math-10a', '_blank')}
              >
                  Join Now
              </SovereignButton>
          </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <PageHeader 
          title={isStudent ? "My Dashboard" : "Student Portal"}
          subtitle={`${student.name} • Class ${student.class}`} 
        />
        <button className="p-2 bg-white border rounded-full relative">
           <Bell className="w-5 h-5 text-gray-600" />
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* KPI GRID - Mobile Optimized (2x2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
         <StatCard 
            title="Fees Due" 
            value={`₹${totalDue.toLocaleString()}`} 
            icon={<Wallet className="w-4 h-4" />} 
            subtitle={invoices.length > 0 ? "Action Required" : "All Clear"}
         />
         <StatCard title="Attendance" value="92%" trend={{ value: 5, isPositive: true }} icon={<CheckCircle className="w-4 h-4" />} />
         <StatCard title="Bus Status" value="On Time" subtitle="ETA 4:10 PM" icon={<Bus className="w-4 h-4" />} />
         <StatCard title="Result" value="A+" subtitle="Term 1" icon={<FileText className="w-4 h-4" />} />
      </div>

      {/* HOMEWORK SECTION (Visible by Default) */}
      {activeModule !== 'FEES' && activeModule !== 'TRACKING' && activeModule !== 'REPORT' && (
          <div className="mb-8">
             <h3 className="font-bold text-gray-800 mb-4">Pending Assignments</h3>
             <div className="space-y-3">
                 {homeworks.map(hw => (
                     <div key={hw.id} className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
                         <div>
                             <h4 className="font-bold text-gray-900">{hw.title}</h4>
                             <p className="text-xs text-gray-500">{hw.subject} • Due {hw.dueDate}</p>
                         </div>
                         {isStudent && hw.status === 'PENDING' ? (
                             <SovereignButton 
                                className="text-xs" 
                                onClick={() => { setSelectedHw(hw.id); setSubmissionModalOpen(true); }}
                             >
                                 Submit
                             </SovereignButton>
                         ) : (
                             <SovereignBadge status={hw.status === 'PENDING' ? 'warning' : 'success'}>{hw.status}</SovereignBadge>
                         )}
                     </div>
                 ))}
             </div>
          </div>
      )}
      
      {activeModule === 'FEES' && <ParentPayments />}

      {activeModule === 'TRACKING' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
             <h2 className="text-lg font-bold text-gray-800">Live Bus Tracking</h2>
          </div>
          <TransportTracking />
        </div>
      )}

      {activeModule === 'REPORT' && (
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Academic Performance</h3>
                <SovereignButton variant="secondary" icon={<Upload className="w-4 h-4 rotate-180" />} onClick={downloadReportCard}>
                    Download PDF
                </SovereignButton>
             </div>
             <div className="pointer-events-none md:pointer-events-auto">
                <Gradebook />
             </div>
        </div>
      )}

      {/* THUMB ZONE ACTION BAR (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
         <SovereignButton className="flex-1 py-3 text-sm" variant="secondary" icon={<Bus className="w-4 h-4"/>}>
           Track Bus
         </SovereignButton>
         <SovereignButton className="flex-1 py-3 text-sm shadow-xl shadow-indigo-500/20" icon={<Wallet className="w-4 h-4"/>}>
           Pay Fees
         </SovereignButton>
      </div>

      {/* Submission Modal */}
      <ActionModal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        title="Submit Assignment"
        footer={
            <SovereignButton onClick={handleSubmitHw}>Upload & Turn In</SovereignButton>
        }
      >
          <div className="space-y-4">
              <SovereignInput label="Your Answer" placeholder="Type here..." />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 text-sm">Tap to attach file (PDF/IMG)</p>
              </div>
          </div>
      </ActionModal>
    </div>
  );
};
