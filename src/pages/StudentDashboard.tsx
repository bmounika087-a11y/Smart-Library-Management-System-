import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import {
  Compass,
  Search,
  BookOpen,
  Clock,
  Calendar,
  AlertTriangle,
  QrCode,
  Sparkles,
  Bookmark,
  TrendingUp,
  Download,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentRoute,
    books,
    loans,
    renewBook,
    returnBook,
    readingGoal,
    setIsScannerOpen,
    setIsDueReminderOpen,
    setIsAskLibrarianOpen,
    downloadMyReportCSV,
    setSelectedBook,
  } = useLibrary();

  const userLoans = loans.filter(l => (currentUser ? l.userId === currentUser.id : true));
  const activeLoans = userLoans.filter(l => l.status === 'active' || l.status === 'overdue');
  const overdueLoans = activeLoans.filter(l => l.status === 'overdue');
  const totalAvailableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);

  // Recommended books (matching CS or AI tags)
  const recommendedBooks = books
    .filter(b => b.category === 'Computer Science & AI' || b.category === 'Quantum Physics & Math')
    .slice(0, 3);

  // Recently added books (newest publishYear)
  const recentlyAddedBooks = [...books].sort((a, b) => b.publishYear - a.publishYear).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Persona Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>Scholar Workspace</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser?.department || 'College of Computing'}</span>
            <span aria-hidden="true">·</span>
            <span>ID: {currentUser?.studentId || 'CS-2026-8842'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Welcome back, <span className="text-cyan-400">{currentUser?.name || 'Alex'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Fall Semester 2026 · You have {currentUser?.borrowLimit ? currentUser.borrowLimit - activeLoans.length : 2} borrow allocation(s) remaining.
          </p>
        </div>

        {/* Quick Report & Support Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={downloadMyReportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download My Borrowing Report (CSV)"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download My Report</span>
          </button>

          <button
            onClick={() => setIsAskLibrarianOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/20"
            title="Ask the Librarian Help Desk"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask the Librarian</span>
          </button>
        </div>
      </div>

      {/* Primary Circulation KPI Metrics (Tabular figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Books Available */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Available Books</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white tabular-nums">
              {totalAvailableCopies}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Across {books.length} distinct curriculum titles
          </div>
        </div>

        {/* Metric 2: Books Currently Borrowed */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Currently Borrowed</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white tabular-nums">
              {activeLoans.length} <span className="text-xs font-normal text-slate-400">/ {currentUser?.borrowLimit || 4} limit</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {currentUser?.borrowLimit ? currentUser.borrowLimit - activeLoans.length : 2} slots available
          </div>
        </div>

        {/* Metric 3: Upcoming Due Dates */}
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Due Date</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {activeLoans.find(l => l.status === 'active')
                ? new Date(activeLoans.find(l => l.status === 'active')!.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'No pending due'}
            </div>
          </div>
          <button
            onClick={() => setIsDueReminderOpen(true)}
            className="mt-3 text-[11px] text-amber-300 hover:text-amber-200 text-left font-medium flex items-center gap-1"
          >
            <span>Configure Due Reminders</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 4: Overdue Books & Fines */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          overdueLoans.length > 0 ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800/80 bg-slate-900/60'
        }`}>
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Overdue Alerts</span>
              <AlertTriangle className={`w-4 h-4 ${overdueLoans.length > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
            </div>
            <div className={`text-3xl font-bold font-mono tabular-nums ${overdueLoans.length > 0 ? 'text-rose-400' : 'text-white'}`}>
              {overdueLoans.length}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {overdueLoans.length > 0 ? (
              <span className="text-rose-300 font-medium">Accumulated fine: $2.50</span>
            ) : (
              <span className="text-emerald-400">Account in good standing</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick-Action Buttons Strip (Functional 17-Button Suite Hub) */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 font-mono">
          Interactive Command Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Button 1: Explore the Galaxy */}
          <button
            onClick={() => setCurrentRoute('explore')}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <Compass className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block">Explore Galaxy</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Browse 8 cosmic disciplines</span>
          </button>

          {/* Button 2: Find My Book */}
          <button
            onClick={() => setCurrentRoute('explore')}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <Search className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block">Find My Book</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Filter title, author, ISBN</span>
          </button>

          {/* Button 8: Scan & Discover */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <QrCode className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block">Scan & Discover</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Camera & barcode optical HUD</span>
          </button>

          {/* Button 7: Smart Recommendations */}
          <button
            onClick={() => setCurrentRoute('recommendations')}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 hover:border-violet-500/40 text-left transition-all group"
          >
            <Sparkles className="w-5 h-5 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block">Smart Picks</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Curriculum match engine</span>
          </button>

          {/* Button 10: My Wishlist */}
          <button
            onClick={() => setCurrentRoute('wishlist')}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 hover:border-amber-500/40 text-left transition-all group"
          >
            <Bookmark className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block">My Wishlist</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Saved reading list</span>
          </button>

          {/* Button 13: Reading Insights */}
          <button
            onClick={() => setCurrentRoute('analytics')}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <TrendingUp className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white block">Reading Insights</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Activity charts & badges</span>
          </button>
        </div>
      </div>

      {/* Currently Borrowed Books with Return / Renew Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Active Loans & Circulation Status</h2>
            <p className="text-xs text-slate-400">Books currently in your possession</p>
          </div>
          <button
            onClick={() => setCurrentRoute('my-books')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Records & History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center">
            <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-white">No Active Books on Loan</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You are free to borrow up to {currentUser?.borrowLimit || 4} volumes from the library catalog.
            </p>
            <button
              onClick={() => setCurrentRoute('explore')}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              Explore Books Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map(loan => {
              const isOverdue = loan.status === 'overdue';
              const daysLeft = Math.ceil(
                (new Date(loan.dueDate).getTime() - new Date('2026-10-17T02:38:49-07:00').getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={loan.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isOverdue ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800 bg-slate-900/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">{loan.category}</span>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isOverdue ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        {isOverdue ? `Overdue · Fine: $${loan.fineAmount.toFixed(2)}` : `${daysLeft}d Remaining`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{loan.bookTitle}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{loan.bookAuthor} · ISBN: {loan.isbn}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                      <span>Due: {new Date(loan.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-slate-400 font-mono">Renewals: {loan.renewalsCount} / 2</span>
                    </div>
                  </div>

                  {/* Return and Renew Functional Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => renewBook(loan.id)}
                      disabled={loan.renewalsCount >= 2}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Renew My Book (+14 days)"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Renew My Book</span>
                    </button>

                    <button
                      onClick={() => returnBook(loan.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/20"
                      title="Return to Library"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Return to Library</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reading Activity & Streak Mini-Section */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-display">14-Day Consecutive Reading Streak</span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">Active</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              You have completed {readingGoal.completedBooks} of your {readingGoal.targetBooks} semester goal books. Keep going!
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentRoute('analytics')}
          className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <span>My Reading Journey</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommended Books Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Smart Curricular Recommendations</h2>
            <p className="text-xs text-slate-400">Algorithmic suggestions for your research profile</p>
          </div>
          <button
            onClick={() => setCurrentRoute('recommendations')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Tune Interests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Recently Added Books */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Recently Added to Library Stacks</h2>
            <p className="text-xs text-slate-400">Latest acquisitions in university archives</p>
          </div>
          <button
            onClick={() => setCurrentRoute('explore')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentlyAddedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};
