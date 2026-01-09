
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SovereignButton, SovereignTable, SovereignInput } from '../../components/SovereignComponents';

export const Gradebook = () => {
  const queryClient = useQueryClient();
  const examId = "exam_123"; // In real app, from select dropdown

  // Fetch Results
  const { data: results, isLoading } = useQuery({
    queryKey: ['results', examId],
    queryFn: async () => {
      // Mocked endpoint for demo, assumes API returns array of students with marks
      return [
        { studentId: 's1', name: 'Aarav', marks: 85 },
        { studentId: 's2', name: 'Diya', marks: 92 }
      ];
    }
  });

  // Upsert Marks Mutation
  const markMutation = useMutation({
    mutationFn: async ({ studentId, marks }: { studentId: string, marks: number }) => {
      await fetch('/api/academics/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ examId, studentId, marks })
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] })
  });

  const handleBlur = (studentId: string, val: string) => {
    markMutation.mutate({ studentId, marks: parseFloat(val) });
  };

  if (isLoading) return <div>Loading Gradebook...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-800">Live Gradebook</h2>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">● Auto-Saving to Cloud</span>
      </div>
      
      <table className="w-full">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-center">Marks Obtained</th>
            <th className="px-4 py-2 text-center">Status</th>
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
                  onBlur={(e) => handleBlur(r.studentId, e.target.value)}
                  className="w-20 border rounded text-center p-1"
                />
              </td>
              <td className="px-4 py-3 text-center text-xs">
                {markMutation.isPending ? 'Saving...' : 'Saved'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
