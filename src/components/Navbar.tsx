import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { PageRoute, UserRole } from '../types/library';
import {
  Compass,
  Bell,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Shield,
  BookOpen,
  UserCheck,
  Sparkles,
  QrCode,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRoute,
    setCurrentRoute,
    logout,
    switchRole,
    theme,
    toggleTheme,
    notifications,
    setIsScannerOpen,
  } = useLibrary();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    setIsMobileNavOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Libra<span className="text-cyan-400">Verse</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean unboxed) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => navigateTo('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentRoute === 'landing' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => navigateTo('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentRoute === 'explore' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Explore Catalog
          </button>

          {currentUser && (
            <>
              <button
                onClick={() =>
                  navigateTo(
                    currentUser.role === 'admin'
                      ? 'admin'
                      : currentUser.role === 'librarian'
                      ? 'librarian'
                      : 'student-dashboard'
                  )
                }
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  ['student-dashboard', 'librarian', 'admin'].includes(currentRoute)
                    ? 'text-cyan-400 font-semibold'
                    : 'hover:text-white'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => navigateTo('my-books')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  currentRoute === 'my-books' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
                }`}
              >
                My Loans
              </button>

              <button
                onClick={() => navigateTo('recommendations')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  currentRoute === 'recommendations' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Smart Picks
              </button>

              <button
                onClick={() => navigateTo('analytics')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  currentRoute === 'analytics' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Insights
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & User Persona */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Scanner Shortcut */}
          <button
            onClick={() => setIsScannerOpen(true)}
            title="Scan & Discover (ISBN Barcode / QR)"
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Theme Toggle (Dark/Light) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          {currentUser && (
            <button
              onClick={() => navigateTo('notifications')}
              title="Notifications & Due-Dates"
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors border border-slate-800"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Auth CTA */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all text-xs font-medium text-slate-200"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-[11px] shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-cyan-400 capitalize font-mono leading-none">
                    {currentUser.role}
                  </div>
                </div>
              </button>

              {/* Persona Switcher & Account Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">ID: {currentUser.studentId}</p>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role Persona
                    </div>
                    <button
                      onClick={() => switchRole('student')}
                      className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                        currentUser.role === 'student' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Student (Alex Rivera)</span>
                    </button>
                    <button
                      onClick={() => switchRole('librarian')}
                      className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                        currentUser.role === 'librarian' ? 'bg-violet-500/15 text-violet-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                      <span>Librarian (Dr. Vance)</span>
                    </button>
                    <button
                      onClick={() => switchRole('admin')}
                      className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                        currentUser.role === 'admin' ? 'bg-amber-500/15 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Admin (Director Hayes)</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-rose-300 hover:bg-rose-500/15 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => navigateTo('landing')}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-850"
          >
            Overview
          </button>
          <button
            onClick={() => navigateTo('explore')}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-850"
          >
            Explore Catalog
          </button>
          {currentUser && (
            <>
              <button
                onClick={() =>
                  navigateTo(
                    currentUser.role === 'admin'
                      ? 'admin'
                      : currentUser.role === 'librarian'
                      ? 'librarian'
                      : 'student-dashboard'
                  )
                }
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-850"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('my-books')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-850"
              >
                My Loans
              </button>
              <button
                onClick={() => navigateTo('recommendations')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-850"
              >
                Smart Picks
              </button>
              <button
                onClick={() => navigateTo('analytics')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-850"
              >
                Insights
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
