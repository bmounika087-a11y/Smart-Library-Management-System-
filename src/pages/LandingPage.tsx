import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import {
  Compass,
  Sparkles,
  ArrowRight,
  BookOpen,
  QrCode,
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute, books, currentUser, setIsScannerOpen } = useLibrary();

  const featuredBooks = books.filter(b => b.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28 border-b border-slate-900">
        {/* Ambient Gradient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Quiet editorial kicker (anti-slop, no code comments) */}
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Academic Library Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
                Smart Library Management System — <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-200 bg-clip-text text-transparent">“LibraVerse”</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Step into a modern, intelligent digital sanctum designed for universities. Explore cross-disciplinary monographs, track loans in real-time, scan physical barcodes via optical sensors, and automate circulation with frictionless precision.
              </p>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setCurrentRoute(currentUser ? 'student-dashboard' : 'login')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center gap-2 group whitespace-nowrap shrink-0"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentRoute('explore')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Explore the Galaxy</span>
                </button>

                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-900 border border-slate-800 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                  title="Scan & Discover Barcode / ISBN"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan & Discover</span>
                </button>
              </div>

              {/* Trust & Discipline Indicators */}
              <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Zero-Loss Circulation Ledger</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Multi-Role RBAC (Student, Librarian, Admin)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Instant CSV Audit Reports</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Digital Library Futuristic Illustration & Floating Books */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* SVG Digital Library Atrium Artwork */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="libGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>

                  <circle cx="200" cy="200" r="160" fill="url(#libGlow)" />
                  <circle cx="200" cy="200" r="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="200" cy="200" r="110" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.4" />
                  <circle cx="200" cy="200" r="70" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.6" />

                  {/* Vault Arches */}
                  <path d="M 60 380 Q 200 120 340 380" stroke="url(#beamGrad)" strokeWidth="2" />
                  <path d="M 100 380 Q 200 180 300 380" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                  <path d="M 140 380 Q 200 240 260 380" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Radiating knowledge coordinate lines */}
                  <line x1="200" y1="40" x2="200" y2="360" stroke="#1e293b" strokeWidth="1" />
                  <line x1="40" y1="200" x2="360" y2="200" stroke="#1e293b" strokeWidth="1" />
                  <line x1="86" y1="86" x2="314" y2="314" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />
                  <line x1="314" y1="86" x2="86" y2="314" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />

                  {/* Luminous nodes / books */}
                  <circle cx="200" cy="90" r="5" fill="#38bdf8" />
                  <circle cx="280" cy="140" r="4" fill="#a855f7" />
                  <circle cx="120" cy="140" r="4" fill="#38bdf8" />
                  <circle cx="200" cy="200" r="7" fill="#f59e0b" />
                  <circle cx="160" cy="260" r="4.5" fill="#34d399" />
                  <circle cx="240" cy="260" r="4.5" fill="#38bdf8" />
                </svg>

                {/* Floating Holographic Book 1 (Top Right) */}
                <div className="animate-float-gentle self-end w-48 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-xl relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-[10px] font-mono text-cyan-300">CS & Cognitive AI</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">Deep Neural Networks</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tier 4 · Shelf 12</p>
                </div>

                {/* Central Hologram Core */}
                <div className="relative z-10 text-center my-auto py-4">
                  <div className="inline-flex p-3 rounded-2xl bg-slate-950/80 border border-slate-700/60 shadow-inner">
                    <BookOpen className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-sm font-bold text-white mt-2 font-display">Nexus Digital Stacks</div>
                  <div className="text-[11px] font-mono text-cyan-300">Live RFID & Catalog Sync</div>
                </div>

                {/* Floating Holographic Book 2 (Bottom Left) */}
                <div className="animate-float-reverse self-start w-52 p-3 rounded-xl bg-slate-900/90 border border-violet-500/30 backdrop-blur-md shadow-xl relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-[10px] font-mono text-violet-300">Quantum Computation</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">Topological Qubits</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Quantum Wing · Pod 8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Quantitative Metric Strip (Tabular discipline) */}
      <section className="py-12 border-b border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total Catalog Volumes</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block tabular-nums">18,450+</span>
              <span className="text-xs text-cyan-400/90 mt-1 block">Indexed physical & digital copies</span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Registered Scholars</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block tabular-nums">3,240</span>
              <span className="text-xs text-indigo-400/90 mt-1 block">Undergrad, masters & faculty</span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Circulation Precision</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block tabular-nums">99.8%</span>
              <span className="text-xs text-emerald-400/90 mt-1 block">Automated reservation accuracy</span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Daily Nexus Access</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block tabular-nums">24 / 7</span>
              <span className="text-xs text-amber-400/90 mt-1 block">Quiet research carrels & labs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Curated Academic Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
                Featured Acquisitions This Term
              </h2>
            </div>
            <button
              onClick={() => setCurrentRoute('explore')}
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View Full 18,000+ Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Core Advantages */}
      <section className="py-20 border-b border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
              Intelligent Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Engineered for Seamless Campus Circulation
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Replacing legacy card catalogs and clunky desktop terminals with a lightning-fast responsive cloud architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Scan & Discover</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan physical barcodes right from your phone camera or laptop webcam to instantly check availability, reserve holds, or view shelf locations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Interest Recommendations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algorithmic recommendation engine suggests relevant monographs based on your academic department, active syllabus courses, and historical checkouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Granular Role-Based Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated interfaces for Students, Circulation Librarians, and Library Directors with full audit trails, loan limit enforcement, and CSV exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">LibraVerse System</span>
            <span>· College of Science & Humanities</span>
          </div>
          <p>© 2026 LibraVerse Academic Library Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
