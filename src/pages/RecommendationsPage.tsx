import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import {
  Sparkles,
  Compass,
  Cpu,
  Brain,
  Sliders,
  Check,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const INTEREST_TAGS = [
  'Machine Learning',
  'Deep Learning',
  'Quantum Computing',
  'Distributed Systems',
  'Astrodynamics',
  'CRISPR',
  'Zero-Trust',
  'Game Theory',
  'Parametric Design',
  'Neuroscience',
];

export const RecommendationsPage: React.FC = () => {
  const { books, setSelectedBook, borrowBook, showToast } = useLibrary();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Machine Learning',
    'Deep Learning',
    'Distributed Systems',
  ]);

  const toggleInterest = (tag: string) => {
    setSelectedInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    showToast('Preferences Updated', 'Recommendation affinity scores re-indexed.', 'info');
  };

  // Rank books according to selected interest tags
  const scoredBooks = books
    .map(book => {
      let matchedCount = 0;
      book.tags.forEach(t => {
        if (selectedInterests.includes(t)) matchedCount++;
      });
      // Base match score calculation
      const score = Math.min(99, Math.round(75 + matchedCount * 8 + (book.rating - 4.5) * 20));
      return {
        book,
        score,
        matchedCount,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Curricular Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            Smart Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailored reading pathways aligned with your academic focus and library checkouts.
          </p>
        </div>
      </div>

      {/* Interactive Interest Preferences Panel */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4 text-violet-400" />
            <span>Select Your Research Interests & Course Domains</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {selectedInterests.length} selected
          </span>
        </div>

        {/* Functional filter tags (buttons with click handlers) */}
        <div className="flex flex-wrap gap-2">
          {INTEREST_TAGS.map(tag => {
            const active = selectedInterests.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 border border-violet-500'
                    : 'bg-slate-950/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Research Pathway Spotlight */}
      <div className="p-6 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/30 via-slate-900 to-cyan-950/30">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Recommended Syllabus Track
          </span>
          <h3 className="text-lg font-bold text-white font-display">
            Track: Autonomous Distributed Intelligence & Reasoning Systems
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Synthesizing deep neural representation theory with distributed planetary consensus and fault-tolerant infrastructure. Recommended for junior & senior thesis preparation.
          </p>
        </div>
      </div>

      {/* Scored Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Ranked by Curriculum Compatibility</span>
          <span>Highest affinity matches shown first</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scoredBooks.map(({ book, score }) => (
            <div key={book.id} className="relative group">
              {/* Match Score Indicator */}
              <div className="absolute top-3 right-12 z-20 px-2 py-0.5 rounded-md bg-violet-950/80 border border-violet-500/40 text-[10px] font-bold text-violet-300 font-mono shadow-sm">
                {score}% Match
              </div>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
