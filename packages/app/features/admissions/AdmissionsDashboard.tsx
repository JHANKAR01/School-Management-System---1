import React, { useState } from 'react';

const MOCK_INQUIRIES = [
  { id: 1, parent: 'Mr. Sharma', phone: '9876543210', class: 'Grade 1', status: 'NEW' },
  { id: 2, parent: 'Mrs. Verma', phone: '9123456780', class: 'Grade 5', status: 'DOCUMENT_PENDING' },
  { id: 3, parent: 'Mr. Khan', phone: '8899776655', class: 'Grade 9', status: 'ADMITTED' },
];

export const AdmissionsDashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admissions CRM</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
          + New Inquiry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-700 font-bold uppercase">Total Inquiries (Today)</p>
          <p className="text-3xl font-black text-blue-900">12</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-700 font-bold uppercase">Pending Documents</p>
          <p className="text-3xl font-black text-orange-900">5</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-sm text-green-700 font-bold uppercase">Converted</p>
          <p className="text-3xl font-black text-green-900">3</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Funnel Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_INQUIRIES.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.parent}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{lead.class}</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{lead.phone}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'ADMITTED' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
