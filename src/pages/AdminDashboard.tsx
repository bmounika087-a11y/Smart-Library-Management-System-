import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { User } from '../types/library';
import {
  Shield,
  Users,
  Settings,
  Download,
  RotateCcw,
  ShieldAlert,
  BookOpen,
  DollarSign,
  CheckCircle2,
  Sliders,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    switchRole,
    allUsers,
    updateUserStatus,
    systemConfig,
    updateSystemConfig,
    downloadMyReportCSV,
    resetAllDemoData,
    books,
    loans,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'users' | 'policy' | 'telemetry'>('users');

  // Policy Form State
  const [loanDays, setLoanDays] = useState(systemConfig.loanDurationDays);
  const [borrowLimit, setBorrowLimit] = useState(systemConfig.maxBorrowLimit);
  const [maxRenewals, setMaxRenewals] = useState(systemConfig.maxRenewalCount);
  const [fineRate, setFineRate] = useState(systemConfig.dailyFineRate);
  const [termLabel, setTermLabel] = useState(systemConfig.academicTerm);

  // Role Gate Check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl border border-amber-500/30 bg-slate-900/90 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Administrator Clearance Required</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Admin Control Center is restricted to Director Marcus Hayes and authorized University Systems Administrators.
        </p>
        <button
          onClick={() => switchRole('admin')}
          className="px-6 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/25"
        >
          Switch to Director Hayes (Admin Account)
        </button>
      </div>
    );
  }

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      loanDurationDays: Number(loanDays),
      maxBorrowLimit: Number(borrowLimit),
      maxRenewalCount: Number(maxRenewals),
      dailyFineRate: Number(fineRate),
      academicTerm: termLabel,
    });
  };

  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const activeLoansCount = loans.filter(l => l.status === 'active' || l.status === 'overdue').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Master Administration Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Director <span className="text-white font-semibold">{currentUser.name}</span> · University Library Systems Core
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={downloadMyReportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Global Audit (CSV)</span>
          </button>

          <button
            onClick={resetAllDemoData}
            title="Reset sample college catalog to pristine factory state"
            className="px-3.5 py-2.5 rounded-xl border border-rose-800/60 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* High-Level Infrastructure Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Patrons</span>
          <span className="text-3xl font-bold font-mono text-white mt-1 block tabular-nums">
            {allUsers.length} <span className="text-xs font-normal text-slate-500">accounts</span>
          </span>
          <span className="text-xs text-emerald-400 mt-1 block">All accounts verified</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Physical Inventory</span>
          <span className="text-3xl font-bold font-mono text-cyan-300 mt-1 block tabular-nums">
            {totalCopies} <span className="text-xs font-normal text-slate-500">total copies</span>
          </span>
          <span className="text-xs text-slate-400 mt-1 block">Across {books.length} academic titles</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Circulation Load</span>
          <span className="text-3xl font-bold font-mono text-amber-400 mt-1 block tabular-nums">
            {activeLoansCount} <span className="text-xs font-normal text-slate-500">active loans</span>
          </span>
          <span className="text-xs text-amber-300 mt-1 block">{Math.round((activeLoansCount / totalCopies) * 100)}% utilization</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Daily Overdue Fine</span>
          <span className="text-3xl font-bold font-mono text-white mt-1 block tabular-nums">
            ${systemConfig.dailyFineRate.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">{systemConfig.loanDurationDays}-day circulation period</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Patron Directory ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'policy' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Circulation Policies
        </button>
      </div>

      {/* Tab 1: Patron Directory & RBAC */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono text-slate-400 tracking-wider">
                <tr>
                  <th className="p-4">Patron Name</th>
                  <th className="p-4">Email & ID</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Borrow Limit</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {allUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 font-sans font-bold text-white">
                      {user.name}
                    </td>
                    <td className="p-4 text-slate-400">
                      <div>{user.email}</div>
                      <div className="text-[10px] text-cyan-400">{user.studentId}</div>
                    </td>
                    <td className="p-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        user.role === 'admin'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : user.role === 'librarian'
                          ? 'bg-violet-950 text-violet-300 border border-violet-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-slate-300">{user.department}</td>
                    <td className="p-4 text-white font-bold">{user.borrowLimit} books</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        user.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          updateUserStatus(
                            user.id,
                            user.status === 'active' ? 'suspended' : 'active',
                            user.borrowLimit === 4 ? 6 : 4
                          )
                        }
                        className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium"
                      >
                        {user.status === 'active' ? 'Toggle +Limit' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Circulation Policies */}
      {activeTab === 'policy' && (
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Library Circulation & Loan Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Parameters apply dynamically across student checkouts, renewals, and overdue penalty calculations.
            </p>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Default Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min={3}
                  max={60}
                  value={loanDays}
                  onChange={e => setLoanDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student Maximum Borrow Limit
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={borrowLimit}
                  onChange={e => setBorrowLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Maximum Allowable Renewals
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={maxRenewals}
                  onChange={e => setMaxRenewals(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daily Overdue Fine Rate ($)
                </label>
                <input
                  type="number"
                  step="0.10"
                  min={0}
                  max={5.0}
                  value={fineRate}
                  onChange={e => setFineRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Active Academic Term Label
              </label>
              <input
                type="text"
                value={termLabel}
                onChange={e => setTermLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
              >
                Save Circulation Rules
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
