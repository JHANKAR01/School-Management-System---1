
import React, { useState } from 'react';
import { useInteraction } from '../../provider/InteractionContext';
import { SovereignButton, SovereignInput, SovereignTable, SovereignBadge, PageHeader } from '../../components/SovereignComponents';
import { ActionModal } from '../../components/ActionModal';
import { Plus, BookOpen, RotateCcw } from 'lucide-react';

export const LibraryManagement = () => {
  const { books, students, addBook, issueBook, returnBook } = useInteraction();
  const [returnIsbn, setReturnIsbn] = useState('');
  
  // Modal States
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIssueModalOpen] = useState(false);

  // Forms
  const [newBook, setNewBook] = useState({ isbn: '', title: '', author: '' });
  const [issueForm, setIssueForm] = useState({ isbn: '', studentId: '' });

  const handleAddBook = () => {
    if (!newBook.isbn || !newBook.title) return alert("Required fields missing");
    addBook({ ...newBook, status: 'AVAILABLE' });
    setAddModalOpen(false);
    setNewBook({ isbn: '', title: '', author: '' });
  };

  const handleIssueBook = () => {
    if (!issueForm.isbn || !issueForm.studentId) return alert("Select Book and Student");
    issueBook(issueForm.isbn, issueForm.studentId);
    setIssueModalOpen(false);
    setIssueForm({ isbn: '', studentId: '' });
  };

  const handleReturn = () => {
    const book = books.find(b => b.isbn === returnIsbn);
    if (!book) return alert("Book not found");
    if (book.status === 'AVAILABLE') return alert("Book is already available");
    
    returnBook(returnIsbn);
    alert(`Returned: ${book.title}. No Fine.`);
    setReturnIsbn('');
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Author", accessor: "author" },
    { header: "ISBN", accessor: "isbn" },
    { header: "Issued To", accessor: (row: any) => row.issuedTo ? students.find(s => s.id === row.issuedTo)?.name || row.issuedTo : '-' },
    { header: "Status", accessor: (row: any) => <SovereignBadge status={row.status === 'AVAILABLE' ? 'success' : 'warning'}>{row.status}</SovereignBadge> }
  ];

  const availableBooks = books.filter(b => b.status === 'AVAILABLE');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Library Circulation" 
        subtitle="Catalog & Issue Desk" 
        action={
            <div className="flex gap-2">
                <SovereignButton variant="secondary" icon={<BookOpen className="w-4 h-4"/>} onClick={() => setIssueModalOpen(true)}>Issue Book</SovereignButton>
                <SovereignButton icon={<Plus className="w-4 h-4"/>} onClick={() => setAddModalOpen(true)}>Add Book</SovereignButton>
            </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit space-y-4">
          <h3 className="font-bold flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-600" /> Return Processor
          </h3>
          <SovereignInput label="Scan ISBN" value={returnIsbn} onChange={e => setReturnIsbn(e.target.value)} placeholder="e.g. 978-01" />
          <div className="mt-4">
            <SovereignButton onClick={handleReturn} className="w-full">
              Process Return
            </SovereignButton>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
           <SovereignTable data={books} columns={columns} />
        </div>
      </div>

      {/* MODAL: Add Book */}
      <ActionModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Book"
        onConfirm={handleAddBook}
        confirmLabel="Add to Inventory"
      >
        <div className="space-y-4">
           <SovereignInput label="Book Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
           <SovereignInput label="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
           <SovereignInput label="ISBN / Barcode" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
        </div>
      </ActionModal>

      {/* MODAL: Issue Book */}
      <ActionModal
        isOpen={isIssueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="Issue Book to Student"
        onConfirm={handleIssueBook}
        confirmLabel="Confirm Issue"
      >
        <div className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Book</label>
             <select 
               className="w-full border p-2 rounded bg-white"
               value={issueForm.isbn}
               onChange={e => setIssueForm({...issueForm, isbn: e.target.value})}
             >
                <option value="">Choose Available Book...</option>
                {availableBooks.map(b => (
                    <option key={b.isbn} value={b.isbn}>{b.title} ({b.isbn})</option>
                ))}
             </select>
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Student</label>
             <select 
               className="w-full border p-2 rounded bg-white"
               value={issueForm.studentId}
               onChange={e => setIssueForm({...issueForm, studentId: e.target.value})}
             >
                <option value="">Choose Student...</option>
                {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                ))}
             </select>
           </div>
        </div>
      </ActionModal>
    </div>
  );
};
