import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { Bookmark, ArrowRight, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, books, toggleWishlist, setCurrentRoute, borrowBook } = useLibrary();

  const wishlistedBooks = books.filter(b => wishlist.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Curations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-0.5">
            My Reading Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Saved monographs, textbooks, and syllabus references for future terms.
          </p>
        </div>

        <button
          onClick={() => setCurrentRoute('explore')}
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Explore More Books</span>
        </button>
      </div>

      {wishlistedBooks.length === 0 ? (
        <div className="p-16 rounded-3xl border border-slate-800 bg-slate-900/40 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Save books you want to read next semester by clicking the bookmark ribbon icon on any card in the catalog.
            </p>
          </div>
          <button
            onClick={() => setCurrentRoute('explore')}
            className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Explore Catalog Books
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              <strong className="text-white font-mono">{wishlistedBooks.length}</strong> title(s) saved in your personal collection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
