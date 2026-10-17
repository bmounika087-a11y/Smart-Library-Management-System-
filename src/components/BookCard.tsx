import React from 'react';
import { Book } from '../types/library';
import { useLibrary } from '../context/LibraryContext';
import { Bookmark, Star, BookOpen, Clock, Check, ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenDetails?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpenDetails }) => {
  const { borrowBook, reserveBook, toggleWishlist, isWishlisted, setSelectedBook } = useLibrary();

  const handleCardClick = () => {
    setSelectedBook(book);
    if (onOpenDetails) onOpenDetails();
  };

  const wishlisted = isWishlisted(book.id);
  const isAvailable = book.availableCopies > 0;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Decorative Book Top Glow & Cover Gradient Banner */}
      <div className={`h-36 w-full bg-gradient-to-br ${book.gradientTheme} p-4 flex flex-col justify-between relative overflow-hidden`}>
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px]" />

        <div className="flex items-start justify-between relative z-10">
          {/* Unboxed editorial category & shelf location */}
          <div className="text-[11px] font-medium text-slate-300/90 tracking-wide flex items-center gap-1.5 drop-shadow-sm">
            <span>{book.category}</span>
          </div>

          {/* Wishlist Button (Functional Affordance) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(book.id);
            }}
            title={wishlisted ? 'Remove from Saved Wishlist' : 'Add to Saved Wishlist'}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              wishlisted
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-black/30 hover:bg-black/50 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badge or Availability Status line */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className={`font-mono text-[11px] font-medium ${isAvailable ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isAvailable ? `${book.availableCopies} Copies Available` : 'Reserved Queue'}
            </span>
          </div>
          {book.coverBadge && (
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {book.coverBadge}
            </span>
          )}
        </div>
      </div>

      {/* Book Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="font-mono text-cyan-400/90">{book.callNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{book.publishYear}</span>
            <span aria-hidden="true">·</span>
            <span>{book.pages} pp</span>
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {book.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            by <span className="text-slate-300">{book.author}</span>
          </p>

          <p className="text-xs text-slate-400/90 mt-2.5 line-clamp-2 leading-relaxed">
            {book.summary}
          </p>
        </div>

        {/* Bottom Bar: Rating & Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white font-mono tabular-nums">{book.rating}</span>
            <span className="text-[11px] text-slate-500 font-mono">({book.reviewsCount})</span>
          </div>

          {/* Interactive Button */}
          {isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                borrowBook(book.id);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 rounded-lg transition-all shadow-sm shadow-cyan-500/20 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Borrow</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                reserveBook(book.id);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Reserve Hold</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
