import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { BookCategory } from '../types/library';
import {
  Compass,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  QrCode,
  BookOpen,
  Atom,
  Rocket,
  Dna,
  ShieldAlert,
  Brain,
  TrendingUp,
  Palette,
} from 'lucide-react';

const CATEGORIES_DATA: { name: BookCategory | 'All'; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { name: 'All', icon: Compass, color: 'text-cyan-400' },
  { name: 'Computer Science & AI', icon: Brain, color: 'text-cyan-400' },
  { name: 'Quantum Physics & Math', icon: Atom, color: 'text-purple-400' },
  { name: 'Aerospace & Robotics', icon: Rocket, color: 'text-sky-400' },
  { name: 'Biotechnology & Genetics', icon: Dna, color: 'text-emerald-400' },
  { name: 'Cybersecurity & Networks', icon: ShieldAlert, color: 'text-amber-400' },
  { name: 'Philosophy & Cognitive Sci', icon: Sparkles, color: 'text-pink-400' },
  { name: 'Economics & Data Analytics', icon: TrendingUp, color: 'text-yellow-400' },
  { name: 'Creative Arts & Architecture', icon: Palette, color: 'text-teal-400' },
];

export const ExplorePage: React.FC = () => {
  const {
    books,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsScannerOpen,
  } = useLibrary();

  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'title' | 'rating' | 'newest'>('popularity');

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(b => b.category === selectedCategory);
    }

    // Availability filter
    if (availableOnly) {
      result = result.filter(b => b.availableCopies > 0);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          b.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'popularity':
        result.sort((a, b) => b.borrowCount - a.borrowCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.publishYear - a.publishYear);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [books, selectedCategory, availableOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Find My Book Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Compass className="w-3.5 h-3.5" />
              <span>Celestial Catalog Navigation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
              Explore the Galaxy of Knowledge
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Discover {books.length} peer-reviewed textbooks, monographs, and research volumes.
            </p>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Scan ISBN / Barcode</span>
          </button>
        </div>

        {/* Find My Book Search & Filter Controls */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Find My Book — search by title, author, keyword, or ISBN..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability Toggle */}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 ${
              availableOnly
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>Available Copies Only</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs font-medium focus:outline-none focus:border-cyan-500"
            >
              <option value="popularity">Sort: Most Borrowed</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="newest">Sort: Newest Edition</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Galaxy Animated Category Grid ("Explore the Galaxy" Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider font-mono">Curricular Disciplines</span>
          <span>Click a realm to filter results</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES_DATA.map(cat => {
            const Icon = cat.icon;
            const count =
              cat.name === 'All' ? books.length : books.filter(b => b.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'border-cyan-500/60 bg-cyan-950/30 shadow-lg shadow-cyan-500/10 -translate-y-0.5'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:scale-105 transition-transform ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {count} {count === 1 ? 'vol' : 'vols'}
                  </span>
                </div>
                <div>
                  <h4 className={`text-xs font-semibold leading-tight line-clamp-1 ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {cat.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white font-mono">{filteredBooks.length}</strong> of{' '}
            <strong className="text-white font-mono">{books.length}</strong> catalog books
          </span>

          {(selectedCategory !== 'All' || searchQuery || availableOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setAvailableOnly(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Catalog Volumes Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No titles match your query "{searchQuery}". Try searching by another keyword, author name, or reset the filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setAvailableOnly(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
            >
              Clear Search & Show All Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
