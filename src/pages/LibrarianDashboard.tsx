import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, BookCategory } from '../types/library';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  X,
  MapPin,
  Users,
  Check,
} from 'lucide-react';

const CATEGORIES: BookCategory[] = [
  'Computer Science & AI',
  'Quantum Physics & Math',
  'Aerospace & Robotics',
  'Biotechnology & Genetics',
  'Cybersecurity & Networks',
  'Philosophy & Cognitive Sci',
  'Economics & Data Analytics',
  'Creative Arts & Architecture',
];

export const LibrarianDashboard: React.FC = () => {
  const {
    currentUser,
    switchRole,
    books,
    loans,
    reservations,
    returnBook,
    renewBook,
    addBook,
    borrowBook,
    showToast,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'circulation' | 'catalog' | 'reservations'>('circulation');
  const [loanSearch, setLoanSearch] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Quick desk checkout form
  const [deskStudentId, setDeskStudentId] = useState('CS-2026-8842');
  const [deskIsbn, setDeskIsbn] = useState('');

  // Add Book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<BookCategory>('Computer Science & AI');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCallNumber, setNewCallNumber] = useState('');
  const [newShelf, setNewShelf] = useState('');
  const [newCopies, setNewCopies] = useState(3);
  const [newPages, setNewPages] = useState(450);
  const [newPublisher, setNewPublisher] = useState('');
  const [newSummary, setNewSummary] = useState('');

  // Role Gate Check
  if (!currentUser || (currentUser.role !== 'librarian' && currentUser.role !== 'admin')) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl border border-violet-500/30 bg-slate-900/90 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/15 text-violet-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Librarian Access Restricted</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Circulation Desk is reserved for Dr. Eleanor Vance and registered college librarians. You are currently logged in as a Student.
        </p>
        <button
          onClick={() => switchRole('librarian')}
          className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/25"
        >
          Switch to Dr. Vance (Librarian Account)
        </button>
      </div>
    );
  }

  const handleDeskCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find(b => b.isbn.replace(/[-\s]/g, '') === deskIsbn.replace(/[-\s]/g, ''));
    if (!targetBook) {
      showToast('Book Not Found', `No book registered with ISBN "${deskIsbn}".`, 'error');
      return;
    }

    borrowBook(targetBook.id);
    setDeskIsbn('');
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newIsbn.trim()) {
      showToast('Missing Fields', 'Title, Author, and ISBN are required.', 'error');
      return;
    }

    addBook({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      isbn: newIsbn.trim(),
      callNumber: newCallNumber.trim() || 'QA 76 .L42 2026',
      shelfLocation: newShelf.trim() || 'Nexus Tower B · Floor 2',
      totalCopies: Number(newCopies) || 1,
      availableCopies: Number(newCopies) || 1,
      rating: 4.8,
      reviewsCount: 1,
      publishYear: 2026,
      pages: Number(newPages) || 300,
      publisher: newPublisher.trim() || 'Academic Academic Press',
      summary: newSummary.trim() || 'Standard curriculum volume for collegiate coursework.',
      tags: [newCategory.split(' ')[0], 'Research', 'Academic'],
      gradientTheme: 'from-cyan-950 via-slate-900 to-slate-950',
      accentColor: '#06b6d4',
    });

    setIsAddBookModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    setNewSummary('');
  };

  const filteredLoans = loans.filter(l =>
    loanSearch
      ? l.bookTitle.toLowerCase().includes(loanSearch.toLowerCase()) ||
        l.userName.toLowerCase().includes(loanSearch.toLowerCase()) ||
        l.userStudentId.toLowerCase().includes(loanSearch.toLowerCase())
      : true
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Circulation & Curatorial Management Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            Librarian Command Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Managing staff: <span className="text-white font-semibold">{currentUser.name}</span> · {books.length} Catalog Titles · {loans.filter(l => l.status === 'active' || l.status === 'overdue').length} Active Loans
          </p>
        </div>

        <button
          onClick={() => setIsAddBookModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/25 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book to Catalog</span>
        </button>
      </div>

      {/* Desk Quick Checkout Form */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 font-mono">
          Fast Desk Check-Out Terminal
        </h3>
        <form onSubmit={handleDeskCheckOut} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={deskStudentId}
              onChange={e => setDeskStudentId(e.target.value)}
              placeholder="Patron Student ID (e.g. CS-2026-8842)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="sm:col-span-5">
            <input
              type="text"
              value={deskIsbn}
              onChange={e => setDeskIsbn(e.target.value)}
              placeholder="Book ISBN (e.g. 978-0-262-54911-3)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors whitespace-nowrap"
            >
              Issue Loan
            </button>
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('circulation')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'circulation' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Active Loans ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'reservations' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Reservations Queue ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'catalog' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Inventory Stock ({books.length})
        </button>
      </div>

      {/* Tab 1: Circulation Management */}
      {activeTab === 'circulation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={loanSearch}
                onChange={e => setLoanSearch(e.target.value)}
                placeholder="Filter loans by title, student name, or ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Loan ID</th>
                    <th className="p-4">Book Title</th>
                    <th className="p-4">Patron Name & ID</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {filteredLoans.map(loan => (
                    <tr key={loan.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4 text-cyan-400">{loan.id}</td>
                      <td className="p-4 font-sans font-medium text-white max-w-xs truncate">
                        {loan.bookTitle}
                      </td>
                      <td className="p-4 font-sans">
                        <span className="text-white block font-medium">{loan.userName}</span>
                        <span className="text-slate-400 text-[11px] font-mono block">{loan.userStudentId}</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            loan.status === 'overdue'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : loan.status === 'returned'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-cyan-950 text-cyan-300'
                          }`}
                        >
                          {loan.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {loan.status !== 'returned' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => renewBook(loan.id)}
                              className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans"
                            >
                              Renew (+14d)
                            </button>
                            <button
                              onClick={() => returnBook(loan.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs font-sans"
                            >
                              Check In
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-sans text-xs">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reservations Queue */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Queue Rank</th>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Patron Name</th>
                  <th className="p-4">Requested On</th>
                  <th className="p-4">Hold Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 text-amber-400 font-bold">#{res.queuePosition}</td>
                    <td className="p-4 font-sans font-medium text-white max-w-xs truncate">
                      {res.bookTitle}
                    </td>
                    <td className="p-4 font-sans text-white">{res.userName} ({res.userStudentId})</td>
                    <td className="p-4 text-slate-400">{new Date(res.requestedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        {res.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Inventory Stock */}
      {activeTab === 'catalog' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Title & Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Shelf Location</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Total Loans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {books.map(b => (
                  <tr key={b.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 font-sans">
                      <span className="font-bold text-white block">{b.title}</span>
                      <span className="text-slate-400 text-xs">{b.author} · {b.isbn}</span>
                    </td>
                    <td className="p-4 font-sans text-slate-300">{b.category}</td>
                    <td className="p-4 text-cyan-300">{b.shelfLocation}</td>
                    <td className="p-4">
                      <span className={`font-bold ${b.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {b.availableCopies} / {b.totalCopies}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{b.borrowCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddBookModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-display mb-1">
              Add New Academic Monograph to Catalog
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter the bibliographic parameters and physical shelf assignment for this acquisition.
            </p>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Principles of Synthetic Genomics"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author(s) *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    placeholder="e.g. Dr. Jennifer Doudna"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as BookCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ISBN 13 *</label>
                  <input
                    type="text"
                    required
                    value={newIsbn}
                    onChange={e => setNewIsbn(e.target.value)}
                    placeholder="978-0-123-45678-9"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Copies</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newCopies}
                    onChange={e => setNewCopies(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Shelf Location</label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={e => setNewShelf(e.target.value)}
                    placeholder="e.g. Nexus Tower A · Level 3, Shelf 14"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publisher & Year</label>
                  <input
                    type="text"
                    value={newPublisher}
                    onChange={e => setNewPublisher(e.target.value)}
                    placeholder="e.g. Cambridge University Press · 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Summary</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Brief synopsis of chapter content and core concepts..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors shadow-md"
                >
                  Commit Book to Stacks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
