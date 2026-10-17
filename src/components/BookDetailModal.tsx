import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, Bookmark, BookOpen, Clock, MapPin, Check, Star, ShieldCheck, Share2 } from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    setSelectedBook,
    borrowBook,
    reserveBook,
    toggleWishlist,
    isWishlisted,
    loans,
    currentUser,
    showToast,
  } = useLibrary();

  if (!selectedBook) return null;

  const book = selectedBook;
  const wishlisted = isWishlisted(book.id);
  const isAvailable = book.availableCopies > 0;
  const alreadyBorrowed = currentUser
    ? loans.some(l => l.userId === currentUser.id && l.bookId === book.id && (l.status === 'active' || l.status === 'overdue'))
    : false;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out "${book.title}" in the LibraVerse catalog (ISBN: ${book.isbn})`);
      showToast('Copied Reference', 'Book citation and ISBN copied to clipboard.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Cover Bar */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${book.gradientTheme} border-b border-slate-800 relative`}>
          <button
            onClick={() => setSelectedBook(null)}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
            aria-label="Close book modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 mb-1">
                <span>{book.category}</span>
                <span aria-hidden="true">·</span>
                <span>{book.publishYear}</span>
                {book.coverBadge && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300 font-semibold">{book.coverBadge}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-snug">
                {book.title}
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Authored by <span className="font-semibold text-white">{book.author}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleWishlist(book.id)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold ${
                  wishlisted
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-black/40 text-slate-200 border-white/10 hover:bg-black/60'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                <span>{wishlisted ? 'Saved' : 'Save to Wishlist'}</span>
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-white/10 bg-black/40 text-slate-200 hover:bg-black/60 transition-colors"
                title="Share Citation"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200">
          {/* Key Facts Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <span className="text-[11px] font-medium text-slate-400 block">Status</span>
              <span className={`text-sm font-semibold font-mono mt-0.5 block ${isAvailable ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isAvailable ? `${book.availableCopies} of ${book.totalCopies} Available` : 'All Loaned Out'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <span className="text-[11px] font-medium text-slate-400 block">Call Number</span>
              <span className="text-sm font-semibold font-mono text-cyan-300 mt-0.5 block truncate">
                {book.callNumber}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <span className="text-[11px] font-medium text-slate-400 block">Rating</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold font-mono text-white">{book.rating}</span>
                <span className="text-xs text-slate-500 font-mono">({book.reviewsCount} reviews)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
              <span className="text-[11px] font-medium text-slate-400 block">Pages & Print</span>
              <span className="text-sm font-semibold font-mono text-slate-200 mt-0.5 block">
                {book.pages} pp · Hardcover
              </span>
            </div>
          </div>

          {/* Physical Shelf Location */}
          <div className="p-4 rounded-xl border border-slate-800 bg-cyan-950/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Physical Shelf Location</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">{book.shelfLocation}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">ISBN 13</span>
              <span className="text-xs font-mono text-slate-300">{book.isbn}</span>
            </div>
          </div>

          {/* Academic Synopsis */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Academic Synopsis & Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {book.summary}
            </p>
          </div>

          {/* Topics / Index Tags (Zero-Pill discipline: unboxed text with separators) */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Curricular Topics & Keywords
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {book.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span className="text-cyan-300/90 font-medium">{tag}</span>
                  {idx < book.tags.length - 1 && <span className="text-slate-600" aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Reservation / Queue Notice if unavailable */}
          {!isAvailable && (
            <div className="p-4 rounded-xl border border-amber-600/30 bg-amber-950/20 text-xs text-amber-200 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Current Queue: {book.waitlist.length} student(s) waiting</p>
                <p className="opacity-90 mt-0.5">
                  Reserving this copy automatically places you in priority line. You will receive an immediate notification as soon as any active copy is returned.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Publisher: <span className="text-slate-300">{book.publisher}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSelectedBook(null)}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
            >
              Close
            </button>

            {alreadyBorrowed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>Currently in Your Active Loans</span>
              </div>
            ) : isAvailable ? (
              <button
                onClick={() => {
                  borrowBook(book.id);
                  setSelectedBook(null);
                }}
                className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Borrow This Book</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  reserveBook(book.id);
                  setSelectedBook(null);
                }}
                className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/50 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Reserve My Copy</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
