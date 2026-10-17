import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserRole } from '../types/library';
import { DEMO_USERS } from '../data/mockData';
import {
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, currentUser, logout, setCurrentRoute, showToast } = useLibrary();

  const [role, setRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('student@libraverse.edu');
  const [password, setPassword] = useState('libra2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Switch preset demo user
  const setDemoRole = (targetRole: UserRole) => {
    setRole(targetRole);
    setErrorMessage(null);
    if (targetRole === 'student') {
      setIdentifier('student@libraverse.edu');
      setPassword('libra2026');
    } else if (targetRole === 'librarian') {
      setIdentifier('librarian@libraverse.edu');
      setPassword('curator2026');
    } else {
      setIdentifier('admin@libraverse.edu');
      setPassword('master2026');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please provide your university email or student ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your access password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const success = login(identifier.trim(), role);
      if (!success) {
        setErrorMessage('Invalid credentials. Please verify your role and ID.');
      }
    }, 700);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setResetSuccessMessage(`Password recovery link dispatched to ${forgotEmail}. Please check your inbox.`);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setResetSuccessMessage(null);
      setForgotEmail('');
      showToast('Reset Link Sent', 'Temporary token issued to your university email.', 'info');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Ambient background aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        {/* Header Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 items-center justify-center text-white shadow-lg shadow-cyan-500/25 mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Sign In to <span className="text-cyan-400">LibraVerse</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            College Digital Library & Research Circulation Portal
          </p>
        </div>

        {/* Role Segmented Selector */}
        <div className="mb-6 p-1 bg-slate-950/80 rounded-xl border border-slate-800 flex gap-1">
          <button
            type="button"
            onClick={() => setDemoRole('student')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setDemoRole('librarian')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'librarian'
                ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Librarian</span>
          </button>
          <button
            type="button"
            onClick={() => setDemoRole('admin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email or Student / Staff ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. student@libraverse.edu or CS-2026-8842"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(identifier);
                  setIsForgotModalOpen(true);
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Enter LibraVerse Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts Quick Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">1-Click Demo Testing:</span>
            <span className="font-mono text-[10px] text-cyan-400">Pre-Configured</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoRole('student')}
              className="p-2 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-cyan-500/40 text-center transition-all"
            >
              <span className="text-[11px] font-bold text-white block">Alex R.</span>
              <span className="text-[9px] text-cyan-400 uppercase font-mono block">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('librarian')}
              className="p-2 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-violet-500/40 text-center transition-all"
            >
              <span className="text-[11px] font-bold text-white block">Dr. Vance</span>
              <span className="text-[9px] text-violet-400 uppercase font-mono block">Librarian</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('admin')}
              className="p-2 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-amber-500/40 text-center transition-all"
            >
              <span className="text-[11px] font-bold text-white block">Dir. Hayes</span>
              <span className="text-[9px] text-amber-400 uppercase font-mono block">Admin</span>
            </button>
          </div>
        </div>

        {/* Technical disclosure per requirements */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Demo Mode Active: Role-based permissions are enforced with browser persistent memory. No plain-text passwords stored.
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white font-display mb-1">Reset Access Key</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered university email to receive a password reset token.
            </p>

            {resetSuccessMessage ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
                {resetSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="student@libraverse.edu"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
