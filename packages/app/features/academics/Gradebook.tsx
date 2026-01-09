import React, { useState, useMemo } from 'react';
import { ExamComponent, StudentResult } from '../../../../types';

// Mock Configuration for a Subject (e.g., Mathematics Class X)
const EXAM_CONFIG: ExamComponent[] = [
  { id: 'ut1', name: 'Unit Test 1', maxMarks: 20, weightage: 20 },
  { id: 'half_yearly', name: 'Half Yearly', maxMarks: 80, weightage: 30 },
  { id: 'final', name: 'Final Exam', maxMarks: 100, weightage: 50 },
];

const MOCK_STUDENTS: StudentResult[] = [
  { studentId: 's1', studentName: 'Aarav Kumar', marks: { ut1: 18, half_yearly: 65 } },
  { studentId: 's2', studentName: 'Diya Sharma', marks: { ut1: 19, half_yearly: 72 } },
  { studentId: 's3', studentName: 'Ishaan Patel', marks: { ut1: 12, half_yearly: 45 } },
];

export const Gradebook = () => {
  const [results, setResults] = useState<StudentResult[]>(MOCK_STUDENTS);
  const [publishing, setPublishing] = useState(false);

  // Handle Mark Entry
  const handleMarkChange = (studentId: string, examId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    // Validate Max Marks
    const max = EXAM_CONFIG.find(e => e.id === examId)?.maxMarks || 100;
    if (numValue > max) return; // Prevent invalid entry

    setResults(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return { ...s, marks: { ...s.marks, [examId]: numValue } };
      }
      return s;
    }));
  };

  // Calculate Weighted Grade
  const calculateFinal = (marks: Record<string, number>) => {
    let totalScore = 0;
    let totalWeight = 0;

    EXAM_CONFIG.forEach(exam => {
      if (marks[exam.id] !== undefined) {
        // Normalize to 100 then apply weight
        const percentage = (marks[exam.id] / exam.maxMarks) * 100;
        totalScore += (percentage * exam.weightage) / 100;
        totalWeight += exam.weightage;
      }
    });

    // If exams are ongoing, project the score based on completed weight
    if (totalWeight === 0) return 0;
    return (totalScore / totalWeight) * 100; // Normalized to 100 scale
  };

  const handlePublish = async () => {
    setPublishing(true);
    // Simulate PDF Generation & Telegram Notification
    await new Promise(r => setTimeout(r, 2000));
    console.log("[Sovereign] PDF Generated client-side using jsPDF");
    console.log("[Sovereign] Telegram Notification sent via Bot API");
    alert("Report Cards Published & Parents Notified via Telegram!");
    setPublishing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Class X - Mathematics Gradebook</h2>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {publishing ? 'Generating PDFs...' : 'Publish Results'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Student Name
              </th>
              {EXAM_CONFIG.map(exam => (
                <th key={exam.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div>{exam.name}</div>
                  <div className="text-[10px] text-gray-400">Max: {exam.maxMarks} | W: {exam.weightage}%</div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider bg-indigo-50">
                Weighted Score (%)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((student) => {
              const finalScore = calculateFinal(student.marks);
              return (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                    {student.studentName}
                  </td>
                  {EXAM_CONFIG.map(exam => (
                    <td key={exam.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="number"
                        min="0"
                        max={exam.maxMarks}
                        value={student.marks[exam.id] || ''}
                        onChange={(e) => handleMarkChange(student.studentId, exam.id, e.target.value)}
                        className="w-16 text-center border border-gray-300 rounded p-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center bg-indigo-50">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      finalScore >= 90 ? 'bg-green-100 text-green-800' :
                      finalScore >= 75 ? 'bg-blue-100 text-blue-800' :
                      finalScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {finalScore.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-2 bg-gray-100 text-xs text-gray-500 text-center">
        Changes saved locally. Sync triggers on Publish.
      </div>
    </div>
  );
};
