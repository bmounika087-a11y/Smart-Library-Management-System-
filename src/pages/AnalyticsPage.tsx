import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  TrendingUp,
  Award,
  Flame,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  Download,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { readingGoal, downloadMyReportCSV, currentUser } = useLibrary();

  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  const maxWeeklyHours = Math.max(...readingGoal.weeklyReadingHours.map(w => w.hours), 6);
  const percentGoal = Math.round((readingGoal.completedBooks / readingGoal.targetBooks) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Academic Performance Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            Reading Journey & Scholarly Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Analytics on research intensity, discipline balance, and semester milestones.
          </p>
        </div>

        <button
          onClick={downloadMyReportCSV}
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Analytics Ledger (CSV)</span>
        </button>
      </div>

      {/* Top Velocity Metrics Strip (Tabular discipline) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Books</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tabular-nums">
            {readingGoal.completedBooks} <span className="text-xs font-normal text-slate-500">/ {readingGoal.targetBooks} goal</span>
          </div>
          <div className="mt-3 text-[11px] text-cyan-400 font-mono">
            {percentGoal}% semester target achieved
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Consecutive Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-400 tabular-nums">
            {readingGoal.readingStreakDays} Days
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Active reading record for Fall 2026
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reading Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tabular-nums">
            {(readingGoal.totalReadingMinutes / 60).toFixed(1)} hrs
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            ~47 pages/day average reading pace
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Academic Badges</span>
            <Award className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white tabular-nums">
            {readingGoal.achievements.filter(a => a.unlocked).length} <span className="text-xs font-normal text-slate-500">/ {readingGoal.achievements.length}</span>
          </div>
          <div className="mt-3 text-[11px] text-violet-300">
            3 unlocked, 2 in progress
          </div>
        </div>
      </div>

      {/* Charts Grid: Weekly Activity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Reading Hours Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Weekly Reading Activity
              </h3>
              <p className="text-xs text-slate-400">Tracked hours spent engaged in library volumes</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Last 7 Days</span>
          </div>

          {/* SVG Interactive Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 px-2">
              {readingGoal.weeklyReadingHours.map((item, index) => {
                const heightPercent = Math.round((item.hours / maxWeeklyHours) * 100);
                const isHovered = activeBarIndex === index;

                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                    onMouseEnter={() => setActiveBarIndex(index)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                  >
                    <div className="text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 tabular-nums">
                      {item.hours}h
                    </div>

                    <div className="w-full bg-slate-950/80 rounded-xl overflow-hidden h-36 flex items-end p-1 border border-slate-800">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]'
                            : 'bg-gradient-to-t from-indigo-600 to-cyan-500'
                        }`}
                      />
                    </div>

                    <span className={`text-xs font-mono transition-colors ${
                      isHovered ? 'text-white font-bold' : 'text-slate-400'
                    }`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Distribution Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Disciplinary Distribution
            </h3>
            <p className="text-xs text-slate-400">Proportion of research across academic domains</p>
          </div>

          <div className="space-y-3 pt-2">
            {readingGoal.categoryDistribution.map(cat => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[200px]">{cat.category}</span>
                  <span className="font-mono text-cyan-300 tabular-nums">{cat.percentage}% ({cat.count} bks)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarly Achievements Section */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Academic Achievements & Badges
          </h3>
          <p className="text-xs text-slate-400">Recognitions earned through active scholarship and circulation discipline</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {readingGoal.achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                ach.unlocked
                  ? 'border-violet-500/40 bg-violet-950/20'
                  : 'border-slate-800/80 bg-slate-950/40 opacity-70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">{ach.title}</h4>
                  {ach.unlocked && (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Unlocked</span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{ach.description}</p>
                {ach.unlocked ? (
                  <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                    Achieved on {ach.unlockedDate}
                  </span>
                ) : (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span>{ach.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${ach.progressPercent}%` }}
                        className="h-full bg-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
