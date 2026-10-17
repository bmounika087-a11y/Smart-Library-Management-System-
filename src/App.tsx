import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { BookDetailModal } from './components/BookDetailModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { DueReminderModal } from './components/DueReminderModal';
import { AskLibrarianModal } from './components/AskLibrarianModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExplorePage } from './pages/ExplorePage';
import { MyBooksPage } from './pages/MyBooksPage';
import { WishlistPage } from './pages/WishlistPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { LibrarianDashboard } from './pages/LibrarianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentRoute, theme } = useLibrary();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'explore':
        return <ExplorePage />;
      case 'my-books':
        return <MyBooksPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'librarian':
        return <LibrarianDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900 light'
    }`}>
      {/* Top Navbar Contract */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Modals & Overlays */}
      <BookDetailModal />
      <BarcodeScannerModal />
      <DueReminderModal />
      <AskLibrarianModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}
