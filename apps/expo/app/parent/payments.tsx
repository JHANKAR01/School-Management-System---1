import React, { useState } from 'react';
import { generateUPILink } from '../../../../packages/api/src/upi-engine';
import { Invoice } from '../../../../types';

// Mock Invoice Data
const PENDING_INVOICE: Invoice = {
  id: 'INV-2024-001',
  studentId: 'ST-101',
  amount: 2450.00,
  description: 'Term 2 Tuition & Lab Fees',
  dueDate: '2024-10-15',
  status: 'PENDING'
};

const SCHOOL_VPA = "greenwood.high@oksbi";
const SCHOOL_NAME = "Greenwood High School";

export default function ParentPayments() {
  const [utr, setUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const upiLink = generateUPILink({
    payeeVPA: SCHOOL_VPA,
    payeeName: SCHOOL_NAME,
    amount: PENDING_INVOICE.amount,
    transactionNote: `Fees ${PENDING_INVOICE.description}`,
    transactionRef: PENDING_INVOICE.id
  });

  const handleSubmitUTR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.length !== 12) {
      alert("Please enter a valid 12-digit UTR/Reference ID from your UPI App.");
      return;
    }

    setSubmitting(true);
    // Simulate API Call to submit UTR
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // In prod: await fetch('/api/payments/submit-utr', { method: 'POST', ... })
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received</h2>
          <p className="text-gray-600 mb-6">
            We have received UTR <span className="font-mono font-bold">{utr}</span>.
            <br/>
            The receipt will be generated automatically once our accountant reconciles the bank statement (approx. 24hrs).
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 p-6 text-white">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Outstanding Fees</p>
          <h1 className="text-3xl font-bold mt-1">₹{PENDING_INVOICE.amount.toLocaleString()}</h1>
          <p className="text-sm opacity-80 mt-2">Due: {PENDING_INVOICE.dueDate}</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Step 1: Pay */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-gray-800">Make Payment</h3>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3">
                Click below to pay via GPay / PhonePe / Paytm directly to the school bank account. No convenience fees.
              </p>
              <a 
                href={upiLink}
                className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition-colors"
              >
                Pay via UPI App
              </a>
              <p className="text-[10px] text-center text-gray-500 mt-2">
                Secure Direct-to-Bank Transfer
              </p>
            </div>
          </div>

          {/* Step 2: Verify */}
          <div className="border-t pt-6">
             <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold text-gray-800">Confirm Payment</h3>
            </div>

            <form onSubmit={handleSubmitUTR}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter 12-Digit UTR / Transaction ID
              </label>
              <input 
                type="text" 
                placeholder="e.g. 324512345678"
                maxLength={12}
                minLength={12}
                pattern="\d*"
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g,''))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2 mb-4">
                You can find this in your UPI app's "History" section after payment.
              </p>
              
              <button
                type="submit"
                disabled={submitting || utr.length !== 12}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-800 transition-all"
              >
                {submitting ? 'Verifying...' : 'Submit UTR for Reconciliation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
