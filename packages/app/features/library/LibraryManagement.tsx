import React, { useState } from 'react';
import { Book } from '../../../../types';

const MOCK_BOOKS: Book[] = [
  { isbn: '978-0131103627', title: 'C Programming Language', author: 'Kernighan & Ritchie', status: 'AVAILABLE' },
  { isbn: '978-0132350884', title: 'Clean Code', author: 'Robert C. Martin', status: 'ISSUED', issuedTo: 's1', dueDate: '2023-10-20' }, // Overdue
];

const FINE_PER_DAY = 5; // INR

export const LibraryManagement = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [search, setSearch] = useState('');

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return diffDays * FINE_PER_DAY;
    return 0;
  };

  const handleReturn = (isbn: string) => {
    const book = books.find(b => b.isbn === isbn);
    if (!book || !book.dueDate) return;

    const fine = calculateFine(book.dueDate);
    
    if (fine > 0) {
      const confirmFine = window.confirm(`Book is overdue by ${fine/FINE_PER_DAY} days. Fine of ₹${fine} will be added to Student Ledger. Proceed?`);
      if (!confirmFine) return;
      
      console.log(`[Sovereign Library] POST /api/finance/add-fine { studentId: ${book.issuedTo}, amount: ${fine} }`);
    }

    setBooks(prev => prev.map(b => b.isbn === isbn ? { ...b, status: 'AVAILABLE', issuedTo: undefined, dueDate: undefined } : b));
    alert("Book Returned Successfully");
  };

  const handleIssue = (isbn: string) => {
    const studentId = prompt("Enter Student ID to Issue:");
    if (!studentId) return;

    // Set Due Date to 14 days from now
    const due = new Date();
    due.setDate(due.getDate() + 14);

    setBooks(prev => prev.map(b => b.isbn === isbn ? { 
      ...b, 
      status: 'ISSUED', 
      issuedTo: studentId, 
      dueDate: due.toISOString().split('T')[0] 
    } : b));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">📚 Sovereign Library</h2>
        <div className="flex gap-2">
           <input 
             type="text" 
             placeholder="Search ISBN / Title..." 
             className="border border-gray-300 rounded px-3 py-1 text-sm"
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
           <button className="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700">
             Scan QR
           </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search)).map(book => (
          <div key={book.isbn} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 truncate" title={book.title}>{book.title}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                book.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {book.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{book.author}</p>
            
            {book.status === 'ISSUED' ? (
              <div className="space-y-2">
                <div className="text-xs bg-gray-50 p-2 rounded">
                  <p>Issued To: <span className="font-mono">{book.issuedTo}</span></p>
                  <p>Due: {book.dueDate}</p>
                  {book.dueDate && calculateFine(book.dueDate) > 0 && (
                     <p className="text-red-600 font-bold mt-1">Fine: ₹{calculateFine(book.dueDate)}</p>
                  )}
                </div>
                <button 
                  onClick={() => handleReturn(book.isbn)}
                  className="w-full bg-gray-900 text-white py-1.5 rounded text-sm hover:bg-gray-700"
                >
                  Return Book
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleIssue(book.isbn)}
                className="w-full border border-indigo-600 text-indigo-600 py-1.5 rounded text-sm hover:bg-indigo-50"
              >
                Issue Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
