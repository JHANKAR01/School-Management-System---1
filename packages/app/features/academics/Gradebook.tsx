
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignTable, SovereignInput, SovereignBadge } from '../../components/SovereignComponents';
import { Download, Calculator, Send } from 'lucide-react';
import { SOVEREIGN_GENESIS_DATA } from '../../../api/src/data/dummy-data';

export const Gradebook = () => {
  const queryClient = useQueryClient();
  const examId = "exam_123";
  const [weights, setWeights] = useState({ theory: 70, practical: 30 });

  const { data: results, isLoading } = useQuery({
    queryKey: ['results', examId],
    queryFn: async () => {
      // Mock Data with broken down marks
      return SOVEREIGN_GENESIS_DATA.students.map(s => ({
        studentId: s.id,
        name: s.name,
        theory: Math.floor(Math.random() * (70 - 40) + 40),
        practical: Math.floor(Math.random() * (30 - 15) + 15),
      }));
    }
  });

  const processedResults = useMemo(() => {
    if (!results) return [];
    return results.map((r: any) => {
      const total = r.theory + r.practical;
      let grade = 'F';
      if (total >= 90) grade = 'A1';
      else if (total >= 80) grade = 'A2';
      else if (total >= 70) grade = 'B1';
      else if (total >= 60) grade = 'B2';
      else if (total >= 33) grade = 'C';
      
      return { ...r, total, grade };
    });
  }, [results]);

  const markMutation = useMutation({
    mutationFn: async ({ studentId, type, val }: { studentId: string, type: 'theory'|'practical', val: number }) => {
      console.log(`[DEMO] Saving ${type}: ${val} for ${studentId}`);
      return { success: true };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] })
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
       // await fetch('/api/academics/publish');
       console.log("Publishing results to parents...");
    },
    onSuccess: () => alert("Results Published! SMS & Push Notifications sent to all parents.")
  });

  if (isLoading) return <div>Loading Gradebook...</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="font-bold text-gray-800 text-lg">Live Gradebook</h2>
           <p className="text-xs text-gray-500">Term 1 • Mathematics</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 text-xs">
              <Calculator className="w-4 h-4 text-gray-500" />
              <span className="font-bold">Weights:</span>
              <span>Theory {weights.theory}%</span>
              <span className="text-gray-300">|</span>
              <span>Practical {weights.practical}%</span>
           </div>
           <SovereignButton onClick={() => publishMutation.mutate()} isLoading={publishMutation.isPending} icon={<Send className="w-3 h-3"/>}>
             Publish Results
           </SovereignButton>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="w-full bg-white">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold border-b">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-center w-32">Theory (70)</th>
              <th className="px-4 py-3 text-center w-32">Practical (30)</th>
              <th className="px-4 py-3 text-center w-24 bg-indigo-50 text-indigo-900">Total (100)</th>
              <th className="px-4 py-3 text-center w-24">Grade</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processedResults.map((r: any) => (
              <tr key={r.studentId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-center">
                  <input 
                    type="number" 
                    defaultValue={r.theory}
                    max={70}
                    onBlur={(e) => markMutation.mutate({ studentId: r.studentId, type: 'theory', val: parseFloat(e.target.value) })}
                    className="w-20 border border-gray-300 rounded text-center p-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input 
                    type="number" 
                    defaultValue={r.practical}
                    max={30}
                    onBlur={(e) => markMutation.mutate({ studentId: r.studentId, type: 'practical', val: parseFloat(e.target.value) })}
                    className="w-20 border border-gray-300 rounded text-center p-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-center font-bold text-indigo-700 bg-indigo-50/50">
                  {r.total}
                </td>
                <td className="px-4 py-3 text-center">
                   <SovereignBadge status={r.grade.startsWith('A') ? 'success' : r.grade === 'F' ? 'error' : 'warning'}>
                      {r.grade}
                   </SovereignBadge>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
