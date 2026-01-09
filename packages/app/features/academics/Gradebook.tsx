
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignTable, SovereignInput } from '../../components/SovereignComponents';
import { Download } from 'lucide-react';

export const Gradebook = () => {
  const queryClient = useQueryClient();
  const examId = "exam_123";

  const { data: results, isLoading } = useQuery({
    queryKey: ['results', examId],
    queryFn: async () => {
      // Mock Data until DB is populated
      return [
        { studentId: 's1', name: 'Aarav Kumar', marks: 85 },
        { studentId: 's2', name: 'Diya Sharma', marks: 92 }
      ];
    }
  });

  const markMutation = useMutation({
    mutationFn: async ({ studentId, marks }: { studentId: string, marks: number }) => {
      await fetch('/api/academics/results', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ examId, studentId, marks })
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] })
  });

  const pdfMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const res = await fetch('/api/academics/generate-report', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ studentId, examId })
      });
      return res.json();
    },
    onSuccess: (data) => {
      window.open(data.url, '_blank');
    }
  });

  if (isLoading) return <div>Loading Gradebook...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-800">Live Gradebook</h2>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">● Auto-Saving</span>
      </div>
      
      <table className="w-full">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-center">Marks</th>
            <th className="px-4 py-2 text-center">Report Card</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {results?.map((r: any) => (
            <tr key={r.studentId}>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3 text-center">
                <input 
                  type="number" 
                  defaultValue={r.marks}
                  onBlur={(e) => markMutation.mutate({ studentId: r.studentId, marks: parseFloat(e.target.value) })}
                  className="w-20 border rounded text-center p-1"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <button 
                  onClick={() => pdfMutation.mutate(r.studentId)}
                  disabled={pdfMutation.isPending}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Download className="w-4 h-4 mx-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
