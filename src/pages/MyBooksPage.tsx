import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Download,
  X,
  FileText,
  Bookmark,
  Check,
} from 'lucide-react';

export const MyBooksPage: React.FC = () => {
  const {
    currentUser,
    loans,
    reservations,
    renewBook,
    returnBook,
    cancelReservation,
    downloadMyReportCSV,
    downloadCalendarICS,
    setCurrentRoute,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'loans' | 'reservations' | 'history'>('loans');

  const userLoans = loans.filter(l => (currentUser ? l.userId === currentUser.id : true));
  const activeLoans = userLoans.filter(l => l.status === 'active' || l.status === 'overdue');
  const pastLoans = userLoans.filter(l => l.status === 'returned');
  const userReservations = reservations.filter(r => (currentUser ? r.userId === currentUser.id : true));

  const totalFines = activeLoans.reduce((sum, l) => sum + (l.fineAmount || 0), 0);

  const getDaysDiff = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = new Date('2026-10-17T02:38:49-07:00').getTime();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Circulation Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            My Books & Loan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your borrowed university materials, due date renewals, and hold reservations.
          </p>
        </div>

        {/* Download My Report Button */}
        <button
          onClick={downloadMyReportCSV}
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Download My Report (CSV)</span>
        </button>
      </div>

      {/* Circulation KPI Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Active Books on Loan</span>
          <span className="text-2xl font-bold font-mono text-white mt-0.5 block tabular-nums">
            {activeLoans.length} <span className="text-xs font-normal text-slate-500">/ {currentUser?.borrowLimit || 4}</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Active Holds / Queue</span>
          <span className="text-2xl font-bold font-mono text-cyan-300 mt-0.5 block tabular-nums">
            {userReservations.length} title(s)
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Accrued Fines</span>
          <span className={`text-2xl font-bold font-mono mt-0.5 block tabular-nums ${totalFines > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${totalFines.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tab Selectors (Interactive Filter Controls per skill guidelines) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'loans'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Loans ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Reservations ({userReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Past Archive ({pastLoans.length})</span>
        </button>
      </div>

      {/* Tab 1: Active Loans */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {activeLoans.length === 0 ? (
            <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Active Borrowed Books</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All borrowed books have been returned to the stacks. Ready to explore new research material?
              </p>
              <button
                onClick={() => setCurrentRoute('explore')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                Browse Books Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeLoans.map(loan => {
                const daysDiff = getDaysDiff(loan.dueDate);
                const isOverdue = loan.status === 'overdue' || daysDiff < 0;

                return (
                  <div
                    key={loan.id}
                    className={`p-6 rounded-3xl border transition-all ${
                      isOverdue
                        ? 'border-rose-500/40 bg-rose-950/20'
                        : daysDiff <= 3
                        ? 'border-amber-500/40 bg-amber-950/20'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-cyan-400 font-semibold">{loan.category}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs font-mono text-slate-400">Loan ID: {loan.id}</span>
                          <span className="text-slate-600">·</span>
                          <span
                            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                              isOverdue
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800'
                            }`}
                          >
                            {isOverdue ? `Overdue (Fine: $${loan.fineAmount.toFixed(2)})` : `${daysDiff} Days Remaining`}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white">{loan.bookTitle}</h3>
                        <p className="text-xs text-slate-300">
                          by {loan.bookAuthor} · <span className="font-mono text-slate-400">ISBN: {loan.isbn}</span>
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 block text-[11px]">Borrowed On</span>
                            <span className="font-mono text-white mt-0.5 block">
                              {new Date(loan.borrowDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 block text-[11px]">Official Due Date</span>
                            <span className="font-mono text-white mt-0.5 block">
                              {new Date(loan.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 block text-[11px]">Renewals Consumed</span>
                            <span className="font-mono text-white mt-0.5 block">{loan.renewalsCount} of 2 allowed</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                            <span className="text-slate-400 block text-[11px]">Accrued Fine</span>
                            <span className={`font-mono font-bold mt-0.5 block ${loan.fineAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                              ${loan.fineAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Buttons Suite */}
                      <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 min-w-[200px]">
                        {/* Button 9: Renew My Book */}
                        <button
                          onClick={() => renewBook(loan.id)}
                          disabled={loan.renewalsCount >= 2}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                          title="Renew loan for an extra 14 days"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Renew My Book (+14d)</span>
                        </button>

                        {/* Button 5: Return to Library */}
                        <button
                          onClick={() => returnBook(loan.id)}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                          title="Check book back in to university stacks"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Return to Library</span>
                        </button>

                        {/* Button: Download Calendar .ics */}
                        <button
                          onClick={() => downloadCalendarICS(loan)}
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Add to Calendar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Hold Reservations */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {userReservations.length === 0 ? (
            <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
              <Clock className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Active Reservations</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When a popular monograph has 0 available copies, click "Reserve My Copy" to enter the automated priority waitlist.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReservations.map(res => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-cyan-400 font-semibold">Hold #{res.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-amber-300 font-mono">
                        Queue Position: #{res.queuePosition}
                      </span>
                      {res.status === 'ready_for_pickup' && (
                        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">
                          Ready for Pickup at Desk
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{res.bookTitle}</h4>
                    <p className="text-xs text-slate-400">
                      Requested on {new Date(res.requestedAt).toLocaleDateString()} · ISBN: {res.isbn}
                    </p>
                  </div>

                  <button
                    onClick={() => cancelReservation(res.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-rose-800/50 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Reservation</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Historical Loans */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Loan Record</th>
                    <th className="p-4">Book Title & Author</th>
                    <th className="p-4">Borrowed</th>
                    <th className="p-4">Returned On</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {pastLoans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500 font-sans">
                        No previous loans recorded in your archive yet.
                      </td>
                    </tr>
                  ) : (
                    pastLoans.map(loan => (
                      <tr key={loan.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 text-cyan-400">{loan.id}</td>
                        <td className="p-4 font-sans font-medium text-white max-w-xs truncate">
                          {loan.bookTitle}
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(loan.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-slate-300">
                          {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="p-4">
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <Check className="w-3 h-3" />
                            <span>Returned</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
