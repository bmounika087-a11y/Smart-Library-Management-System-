import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, QrCode, Camera, Search, BookOpen, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Book } from '../types/library';

export const BarcodeScannerModal: React.FC = () => {
  const { isScannerOpen, setIsScannerOpen, books, setSelectedBook, borrowBook, showToast } = useLibrary();

  const [manualIsbn, setManualIsbn] = useState('');
  const [detectedBook, setDetectedBook] = useState<Book | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize or attempt camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isScannerOpen) {
      setIsScanning(true);
      setDetectedBook(null);

      // Attempt live webcam if supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then(mediaStream => {
            stream = mediaStream;
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play().catch(() => {});
              setCameraActive(true);
            }
          })
          .catch(() => {
            setCameraActive(false);
            setCameraError('Camera access unavailable or declined. Using optical sensor simulation and manual barcode entry.');
          });
      } else {
        setCameraActive(false);
        setCameraError('Optical camera sensor not supported by browser environment.');
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
      setCameraError(null);
    };
  }, [isScannerOpen]);

  if (!isScannerOpen) return null;

  const handleLookupIsbn = (queryIsbn: string) => {
    const cleaned = queryIsbn.trim().replace(/[-\s]/g, '');
    const match = books.find(b => b.isbn.replace(/[-\s]/g, '') === cleaned || b.isbn.includes(queryIsbn.trim()));

    if (match) {
      setDetectedBook(match);
      setIsScanning(false);
      showToast('Scan Successful', `Identified: "${match.title}"`, 'success');
    } else {
      showToast('No Match Found', `No catalog volume corresponds to ISBN "${queryIsbn}".`, 'warning');
    }
  };

  const handleSampleScan = (isbn: string) => {
    setManualIsbn(isbn);
    handleLookupIsbn(isbn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Scan & Discover</h3>
              <p className="text-xs text-slate-400">Library Optical Barcode & QR Scanner</p>
            </div>
          </div>
          <button
            onClick={() => setIsScannerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport & Camera Section */}
        <div className="p-6 space-y-6">
          {/* Scanner Viewport Box */}
          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
            ) : (
              /* Simulated Scanner Grid and Optical HUD */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 text-center">
                <div className="w-48 h-32 rounded-xl border-2 border-dashed border-cyan-500/40 relative flex items-center justify-center bg-cyan-950/10">
                  {/* Glowing Laser Scanline */}
                  {isScanning && (
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
                  )}
                  <QrCode className="w-12 h-12 text-cyan-400/50" />
                </div>
                <p className="text-xs text-slate-400 mt-3 max-w-xs">
                  {cameraError || 'Align physical book barcode or ISBN inside the reticle'}
                </p>
              </div>
            )}

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />
          </div>

          {/* Detected Book Card or Results */}
          {detectedBook ? (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified Catalog Match</span>
                </div>
                <h4 className="text-sm font-bold text-white truncate">{detectedBook.title}</h4>
                <p className="text-xs text-slate-400">
                  {detectedBook.author} · <span className="font-mono text-cyan-300">{detectedBook.shelfLocation}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedBook(detectedBook);
                    setIsScannerOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    borrowBook(detectedBook.id);
                    setIsScannerOpen(false);
                  }}
                  disabled={detectedBook.availableCopies <= 0}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-all"
                >
                  Borrow Now
                </button>
              </div>
            </div>
          ) : (
            /* Manual Fallback ISBN Entry */
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Manual ISBN Fallback Input
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={manualIsbn}
                    onChange={e => setManualIsbn(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLookupIsbn(manualIsbn)}
                    placeholder="Enter ISBN (e.g. 978-0-262-54911-3)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <button
                  onClick={() => handleLookupIsbn(manualIsbn)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Look Up</span>
                </button>
              </div>

              {/* Instant Test Barcodes for Demo Verification */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Click to simulate scanning real library barcodes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSampleScan('978-0-262-54911-3')}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    Deep Neural Networks (CS)
                  </button>
                  <button
                    onClick={() => handleSampleScan('978-0-198-84210-9')}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    Quantum Computation (Physics)
                  </button>
                  <button
                    onClick={() => handleSampleScan('978-1-119-80456-1')}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    Orbital Dynamics (Aero)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
