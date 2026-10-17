import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Sliders,
  ArrowRight,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentRoute,
    setIsDueReminderOpen,
  } = useLibrary();

  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Bell className="w-3.5 h-3.5" />
            <span>Campus Dispatch Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            Notifications & Due Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time updates regarding loans, holds, and circulation policies.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDueReminderOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preferences</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            filterType === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('overdue')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            filterType === 'overdue' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overdue
        </button>
        <button
          onClick={() => setFilterType('due_date')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            filterType === 'due_date' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Due Reminders
        </button>
        <button
          onClick={() => setFilterType('reservation')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
            filterType === 'reservation' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Holds & Pickup
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/40 text-center">
            <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-white">No Notifications</h3>
            <p className="text-xs text-slate-400 mt-1">You are completely up to date.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const getIcon = () => {
              switch (notif.type) {
                case 'overdue':
                  return <AlertTriangle className="w-5 h-5 text-rose-400" />;
                case 'due_date':
                  return <Clock className="w-5 h-5 text-amber-400" />;
                case 'reservation':
                  return <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
                default:
                  return <Sparkles className="w-5 h-5 text-violet-400" />;
              }
            };

            return (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.actionRoute) setCurrentRoute(notif.actionRoute);
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  !notif.read
                    ? 'border-cyan-500/40 bg-slate-900/90 shadow-md shadow-cyan-500/5'
                    : 'border-slate-800 bg-slate-900/40 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold ${!notif.read ? 'text-white' : 'text-slate-200'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>

                  {notif.actionRoute && (
                    <div className="mt-2 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline">
                      <span>View in {notif.actionRoute === 'my-books' ? 'My Loans' : notif.actionRoute}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
