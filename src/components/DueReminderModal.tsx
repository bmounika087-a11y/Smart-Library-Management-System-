import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, Calendar, Bell, AlertTriangle, CheckCircle, Clock, Download, Shield } from 'lucide-react';

export const DueReminderModal: React.FC = () => {
  const {
    isDueReminderOpen,
    setIsDueReminderOpen,
    currentUser,
    loans,
    notificationPreferences,
    updateNotificationPreferences,
    downloadCalendarICS,
    renewBook,
  } = useLibrary();

  const [emailAlerts, setEmailAlerts] = useState(notificationPreferences.emailAlerts);
  const [smsAlerts, setSmsAlerts] = useState(notificationPreferences.smsAlerts);
  const [reminderDays, setReminderDays] = useState(notificationPreferences.dueReminderDays);
  const [reservationAlerts, setReservationAlerts] = useState(notificationPreferences.reservationReadyAlerts);

  if (!isDueReminderOpen) return null;

  const userActiveLoans = loans.filter(
    l => (currentUser ? l.userId === currentUser.id : true) && (l.status === 'active' || l.status === 'overdue')
  );

  const handleSavePreferences = () => {
    updateNotificationPreferences({
      emailAlerts,
      smsAlerts,
      dueReminderDays: reminderDays,
      reservationReadyAlerts: reservationAlerts,
    });
    setIsDueReminderOpen(false);
  };

  const getDaysRemaining = (dueDateStr: string) => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date('2026-10-17T02:38:49-07:00').getTime(); // using current time context
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Due-Date Reminders & Alerts</h3>
              <p className="text-xs text-slate-400">Circulation Schedules and Notification Preferences</p>
            </div>
          </div>
          <button
            onClick={() => setIsDueReminderOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Active Loan Due Dates */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active Loan Due Timelines</span>
            </h4>

            {userActiveLoans.length === 0 ? (
              <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/40 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-white">No Pending Due Dates</p>
                <p className="text-xs text-slate-400 mt-1">
                  You currently have no active or overdue books checked out.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userActiveLoans.map(loan => {
                  const daysLeft = getDaysRemaining(loan.dueDate);
                  const isOverdue = loan.status === 'overdue' || daysLeft < 0;

                  return (
                    <div
                      key={loan.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isOverdue
                          ? 'border-rose-500/40 bg-rose-950/20'
                          : daysLeft <= 3
                          ? 'border-amber-500/40 bg-amber-950/20'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[11px] font-mono font-semibold ${
                              isOverdue ? 'text-rose-400' : daysLeft <= 3 ? 'text-amber-400' : 'text-cyan-400'
                            }`}
                          >
                            {isOverdue
                              ? `OVERDUE (Fine: $${loan.fineAmount.toFixed(2)})`
                              : `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Remaining`}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-slate-400 font-mono">
                            Due {new Date(loan.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-white truncate">{loan.bookTitle}</h5>
                        <p className="text-xs text-slate-400">{loan.bookAuthor} · ISBN: {loan.isbn}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => downloadCalendarICS(loan)}
                          title="Add Due Date to Google/Apple Calendar (.ics)"
                          className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>.ICS Calendar</span>
                        </button>

                        <button
                          onClick={() => renewBook(loan.id)}
                          disabled={loan.renewalsCount >= 2}
                          className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 text-xs font-semibold transition-colors"
                        >
                          Renew (+14d)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Notification Preferences */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Notification Channels & Cadence</span>
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/30">
                <div>
                  <span className="text-sm font-semibold text-white block">University Email Alerts</span>
                  <span className="text-xs text-slate-400">Receive dispatch emails to {currentUser?.email || 'student@libraverse.edu'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/30">
                <div>
                  <span className="text-sm font-semibold text-white block">Campus SMS Reminders</span>
                  <span className="text-xs text-slate-400">Instant SMS dispatch to registered mobile device</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={e => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/30">
                <div>
                  <span className="text-sm font-semibold text-white block">Reservation Availability Alerts</span>
                  <span className="text-xs text-slate-400">Immediate push when a requested volume returns to circulation</span>
                </div>
                <input
                  type="checkbox"
                  checked={reservationAlerts}
                  onChange={e => setReservationAlerts(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/30 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-white block">Advance Notice Window</span>
                  <span className="text-xs text-slate-400">How many days before the due date should the system ping you?</span>
                </div>
                <select
                  value={reminderDays}
                  onChange={e => setReminderDays(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value={1}>1 Day Prior</option>
                  <option value={2}>2 Days Prior</option>
                  <option value={3}>3 Days Prior</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={() => setIsDueReminderOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
};
