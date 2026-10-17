import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Book,
  User,
  UserRole,
  Loan,
  Reservation,
  NotificationItem,
  ReadingGoal,
  SystemConfig,
  NotificationPreferences,
  PageRoute,
} from '../types/library';
import {
  INITIAL_BOOKS,
  DEMO_USERS,
  INITIAL_LOANS,
  INITIAL_RESERVATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_READING_GOAL,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_NOTIFICATION_PREFERENCES,
  INITIAL_WISHLIST,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface LibraryContextType {
  // Navigation & User
  currentUser: User | null;
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Catalog & Search
  books: Book[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;

  // Core Circulation Actions
  loans: Loan[];
  reservations: Reservation[];
  wishlist: string[];
  borrowBook: (bookId: string) => boolean;
  returnBook: (loanId: string) => boolean;
  renewBook: (loanId: string) => boolean;
  reserveBook: (bookId: string) => boolean;
  cancelReservation: (reservationId: string) => void;
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;

  // Admin & Staff Operations
  addBook: (newBook: Omit<Book, 'id' | 'borrowCount' | 'waitlist'>) => void;
  updateBook: (updated: Book) => void;
  deleteBook: (bookId: string) => void;
  systemConfig: SystemConfig;
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  allUsers: User[];
  updateUserStatus: (userId: string, status: User['status'], limit?: number) => void;

  // Reading Goal & Notifications
  readingGoal: ReadingGoal;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;

  // Modals & Tools
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isDueReminderOpen: boolean;
  setIsDueReminderOpen: (open: boolean) => void;
  isAskLibrarianOpen: boolean;
  setIsAskLibrarianOpen: (open: boolean) => void;

  // Utilities & Buttons
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  downloadMyReportCSV: () => void;
  downloadCalendarICS: (loan: Loan) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  resetAllDemoData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'libraverse_user',
  BOOKS: 'libraverse_books',
  LOANS: 'libraverse_loans',
  RESERVATIONS: 'libraverse_reservations',
  WISHLIST: 'libraverse_wishlist',
  NOTIFICATIONS: 'libraverse_notifications',
  GOALS: 'libraverse_goals',
  CONFIG: 'libraverse_config',
  PREFS: 'libraverse_prefs',
  THEME: 'libraverse_theme',
  USERS_LIST: 'libraverse_all_users',
};

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'light' ? 'light' : 'dark';
  });

  // Current route
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('landing');

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.student;
      }
    }
    return DEMO_USERS.student;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return Object.values(DEMO_USERS);
      }
    }
    return [
      DEMO_USERS.student,
      DEMO_USERS.librarian,
      DEMO_USERS.admin,
      {
        id: 'user-02',
        name: 'Maya Patel',
        email: 'maya.patel@libraverse.edu',
        studentId: 'SEC-2025-4192',
        role: 'student',
        department: 'Cybersecurity & Info Assurance',
        year: 'Senior · 4th Year',
        borrowLimit: 4,
        activeLoansCount: 1,
        joinedDate: 'Jan 2024',
        status: 'active',
      },
      {
        id: 'user-04',
        name: 'Elena Rostova',
        email: 'elena.rostova@libraverse.edu',
        studentId: 'PHY-2025-9921',
        role: 'student',
        department: 'Quantum Physics & Microelectronics',
        year: 'Graduate · 1st Year',
        borrowLimit: 6,
        activeLoansCount: 0,
        joinedDate: 'Aug 2025',
        status: 'active',
      }
    ];
  });

  // Books state
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BOOKS;
      }
    }
    return INITIAL_BOOKS;
  });

  // Loans state
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_LOANS;
      }
    }
    return INITIAL_LOANS;
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_RESERVATIONS;
      }
    }
    return INITIAL_RESERVATIONS;
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WISHLIST;
      }
    }
    return INITIAL_WISHLIST;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Reading Goal
  const [readingGoal, setReadingGoal] = useState<ReadingGoal>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_READING_GOAL;
      }
    }
    return INITIAL_READING_GOAL;
  });

  // System Configuration
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SYSTEM_CONFIG;
      }
    }
    return INITIAL_SYSTEM_CONFIG;
  });

  // Notification Preferences
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTIFICATION_PREFERENCES;
      }
    }
    return INITIAL_NOTIFICATION_PREFERENCES;
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDueReminderOpen, setIsDueReminderOpen] = useState(false);
  const [isAskLibrarianOpen, setIsAskLibrarianOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(allUsers));
  }, [allUsers]);

  // Toast Helpers
  const showToast = useCallback((title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth operations
  const login = (email: string, role: UserRole = 'student'): boolean => {
    let matchedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      if (role === 'librarian') matchedUser = DEMO_USERS.librarian;
      else if (role === 'admin') matchedUser = DEMO_USERS.admin;
      else matchedUser = DEMO_USERS.student;
    }

    setCurrentUser(matchedUser);
    showToast('Welcome to LibraVerse', `Authenticated as ${matchedUser.name} (${matchedUser.role})`, 'success');

    // Route to appropriate dashboard
    if (matchedUser.role === 'admin') setCurrentRoute('admin');
    else if (matchedUser.role === 'librarian') setCurrentRoute('librarian');
    else setCurrentRoute('student-dashboard');

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRoute('login');
    showToast('Logged out', 'You have been safely signed out of LibraVerse.', 'info');
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    if (targetUser) {
      setCurrentUser(targetUser);
      showToast('Switched Persona', `Active account: ${targetUser.name} · ${targetUser.role.toUpperCase()}`, 'info');
      if (role === 'admin') setCurrentRoute('admin');
      else if (role === 'librarian') setCurrentRoute('librarian');
      else setCurrentRoute('student-dashboard');
    }
  };

  // Core Borrow Action
  const borrowBook = (bookId: string): boolean => {
    if (!currentUser) {
      showToast('Login Required', 'Please sign in with your student credentials to borrow books.', 'warning');
      setCurrentRoute('login');
      return false;
    }

    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) {
      showToast('Book Not Found', 'Could not locate book record in the catalog.', 'error');
      return false;
    }

    if (targetBook.availableCopies <= 0) {
      showToast('Unavailable for Loan', 'All copies are currently checked out. Click "Reserve My Copy" to join the queue.', 'warning');
      return false;
    }

    // Check active loans by this user for this book
    const existingLoan = loans.find(
      l => l.userId === currentUser.id && l.bookId === bookId && (l.status === 'active' || l.status === 'overdue')
    );
    if (existingLoan) {
      showToast('Already Borrowed', 'You currently have an active loan for this book.', 'warning');
      return false;
    }

    // Check student borrow limit
    const activeLoans = loans.filter(l => l.userId === currentUser.id && (l.status === 'active' || l.status === 'overdue'));
    if (activeLoans.length >= currentUser.borrowLimit) {
      showToast('Borrow Limit Reached', `Your maximum allowable loans is ${currentUser.borrowLimit} books. Return a book to borrow more.`, 'error');
      return false;
    }

    // Calculate dates
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + systemConfig.loanDurationDays);

    const newLoan: Loan = {
      id: `loan-${Date.now().toString().slice(-5)}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      bookAuthor: targetBook.author,
      category: targetBook.category,
      isbn: targetBook.isbn,
      userId: currentUser.id,
      userName: currentUser.name,
      userStudentId: currentUser.studentId,
      borrowDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      renewalsCount: 0,
      status: 'active',
      fineAmount: 0,
    };

    // Update Book copies
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1, borrowCount: b.borrowCount + 1 } : b))
    );

    // Update Loans
    setLoans(prev => [newLoan, ...prev]);

    // Update User Loan count
    setCurrentUser(prev => prev ? { ...prev, activeLoansCount: prev.activeLoansCount + 1 } : null);

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Book Borrowed Successfully',
      message: `"${targetBook.title}" is due on ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. Pick up from ${targetBook.shelfLocation}.`,
      type: 'due_date',
      timestamp: now.toISOString(),
      read: false,
      actionRoute: 'my-books',
    };
    setNotifications(prev => [notif, ...prev]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#8b5cf6', '#f59e0b', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    showToast('Success!', `"${targetBook.title}" borrowed. Due in ${systemConfig.loanDurationDays} days.`, 'success');
    return true;
  };

  // Return Book Action
  const returnBook = (loanId: string): boolean => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) {
      showToast('Error', 'Loan record not found.', 'error');
      return false;
    }

    const returnTime = new Date().toISOString();

    // Mark loan returned
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'returned', returnDate: returnTime } : l))
    );

    // Restore book availableCopies
    setBooks(prev => {
      return prev.map(b => {
        if (b.id === loan.bookId) {
          const updatedCopies = b.availableCopies + 1;
          // Check if there is someone waiting in the waitlist!
          if (b.waitlist.length > 0) {
            const nextUserId = b.waitlist[0];
            // Update reservation status
            setReservations(resList =>
              resList.map(r =>
                r.bookId === b.id && r.userId === nextUserId
                  ? { ...r, status: 'ready_for_pickup', notifiedAt: returnTime }
                  : r
              )
            );
            // Notify next user
            setNotifications(nList => [
              {
                id: `notif-${Date.now()}`,
                userId: nextUserId,
                title: 'Reservation Ready for Pickup',
                message: `"${b.title}" has just been checked in and is reserved for you at the Circulation Desk for 48 hours.`,
                type: 'reservation',
                timestamp: returnTime,
                read: false,
                actionRoute: 'my-books',
              },
              ...nList,
            ]);
          }
          return { ...b, availableCopies: updatedCopies };
        }
        return b;
      });
    });

    // Update user active count
    if (currentUser && currentUser.id === loan.userId) {
      setCurrentUser(prev => prev ? { ...prev, activeLoansCount: Math.max(0, prev.activeLoansCount - 1) } : null);
    }

    // Increment completed reading goal
    setReadingGoal(prev => ({
      ...prev,
      completedBooks: prev.completedBooks + 1,
    }));

    showToast('Returned Successfully', `"${loan.bookTitle}" has been checked in to the catalog.`, 'success');
    return true;
  };

  // Renew Book Action
  const renewBook = (loanId: string): boolean => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) {
      showToast('Error', 'Loan not found.', 'error');
      return false;
    }

    if (loan.status === 'returned') {
      showToast('Cannot Renew', 'This book has already been returned.', 'warning');
      return false;
    }

    if (loan.renewalsCount >= systemConfig.maxRenewalCount) {
      showToast('Renewal Limit Exceeded', `This book has already been renewed the maximum allowed (${systemConfig.maxRenewalCount} times). Please return the book.`, 'error');
      return false;
    }

    // Check if book has a waiting list
    const book = books.find(b => b.id === loan.bookId);
    if (book && book.waitlist.length > 0) {
      showToast('Renewal Denied', 'Other students are on the waiting list for this volume. Please return on time.', 'warning');
      return false;
    }

    // Extend due date by loanDurationDays
    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + systemConfig.loanDurationDays);

    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? {
              ...l,
              dueDate: currentDue.toISOString(),
              renewalsCount: l.renewalsCount + 1,
              status: 'active',
              fineAmount: 0,
            }
          : l
      )
    );

    showToast('Renewal Confirmed', `Due date extended to ${currentDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (+${systemConfig.loanDurationDays} days).`, 'success');
    return true;
  };

  // Reserve Book Action
  const reserveBook = (bookId: string): boolean => {
    if (!currentUser) {
      showToast('Login Required', 'Please log in to place book holds or reservations.', 'warning');
      setCurrentRoute('login');
      return false;
    }

    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) {
      showToast('Error', 'Book not found.', 'error');
      return false;
    }

    // Check if user already holds active reservation
    const existing = reservations.find(r => r.bookId === bookId && r.userId === currentUser.id && r.status === 'waiting');
    if (existing) {
      showToast('Already Reserved', `You are already #${existing.queuePosition} on the waitlist for this title.`, 'info');
      return false;
    }

    const nextPosition = (targetBook.waitlist?.length || 0) + 1;

    const newReservation: Reservation = {
      id: `res-${Date.now().toString().slice(-5)}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      bookAuthor: targetBook.author,
      isbn: targetBook.isbn,
      userId: currentUser.id,
      userName: currentUser.name,
      userStudentId: currentUser.studentId,
      requestedAt: new Date().toISOString(),
      status: 'waiting',
      queuePosition: nextPosition,
    };

    setReservations(prev => [...prev, newReservation]);
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, waitlist: [...(b.waitlist || []), currentUser.id] } : b))
    );

    showToast('Hold Confirmed', `You are #${nextPosition} in queue for "${targetBook.title}". We will notify you when a copy returns.`, 'success');
    return true;
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setReservations(prev => prev.filter(r => r.id !== reservationId));
    setBooks(prev =>
      prev.map(b => (b.id === res.bookId ? { ...b, waitlist: (b.waitlist || []).filter(u => u !== res.userId) } : b))
    );

    showToast('Hold Cancelled', `Reservation for "${res.bookTitle}" has been cancelled.`, 'info');
  };

  // Wishlist Action
  const toggleWishlist = (bookId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(bookId);
      if (exists) {
        showToast('Removed from Wishlist', 'Title removed from your saved reading list.', 'info');
        return prev.filter(id => id !== bookId);
      } else {
        showToast('Added to Wishlist', 'Title saved to your personal reading list.', 'success');
        return [...prev, bookId];
      }
    });
  };

  const isWishlisted = (bookId: string) => wishlist.includes(bookId);

  // Admin / Librarian Catalog Actions
  const addBook = (newBookData: Omit<Book, 'id' | 'borrowCount' | 'waitlist'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `book-${Date.now().toString().slice(-4)}`,
      borrowCount: 0,
      waitlist: [],
    };
    setBooks(prev => [newBook, ...prev]);
    showToast('Catalog Updated', `Added "${newBook.title}" to library collection.`, 'success');
  };

  const updateBook = (updated: Book) => {
    setBooks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
    showToast('Book Updated', `Changes to "${updated.title}" saved.`, 'success');
  };

  const deleteBook = (bookId: string) => {
    const target = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    showToast('Book Removed', `"${target?.title || 'Book'}" removed from active inventory.`, 'info');
  };

  const updateSystemConfig = (newConfig: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({ ...prev, ...newConfig }));
    showToast('Policies Updated', 'Library loan policies and circulation rules saved.', 'success');
  };

  const updateUserStatus = (userId: string, status: User['status'], limit?: number) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status, ...(limit ? { borrowLimit: limit } : {}) } : u))
    );
    showToast('User Record Updated', `Patron status updated.`, 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All Caught Up', 'All notifications marked as read.', 'info');
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({ ...prev, ...prefs }));
    showToast('Preferences Saved', 'Your alert and due-date reminder settings are updated.', 'success');
  };

  // Export CSV Action
  const downloadMyReportCSV = () => {
    const userLoans = loans.filter(l => (currentUser ? l.userId === currentUser.id : true));
    if (userLoans.length === 0) {
      showToast('No Records', 'No circulation history available to export yet.', 'warning');
      return;
    }

    const headers = ['Loan ID', 'Book Title', 'Author', 'ISBN', 'Borrow Date', 'Due Date', 'Return Date', 'Status', 'Fine ($)'];
    const rows = userLoans.map(l => [
      `"${l.id}"`,
      `"${l.bookTitle.replace(/"/g, '""')}"`,
      `"${l.bookAuthor.replace(/"/g, '""')}"`,
      `"${l.isbn}"`,
      `"${new Date(l.borrowDate).toLocaleDateString()}"`,
      `"${new Date(l.dueDate).toLocaleDateString()}"`,
      l.returnDate ? `"${new Date(l.returnDate).toLocaleDateString()}"` : '"N/A"',
      `"${l.status.toUpperCase()}"`,
      `"${l.fineAmount.toFixed(2)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LibraVerse_Report_${currentUser?.studentId || 'History'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Downloaded', 'Borrowing history exported as CSV.', 'success');
  };

  // Export Calendar .ics Action for Due Date Reminder
  const downloadCalendarICS = (loan: Loan) => {
    const dueDate = new Date(loan.dueDate);
    const startStr = dueDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LibraVerse//Smart Library System//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Library Due Date: ${loan.bookTitle}`,
      `DESCRIPTION:Please return or renew '${loan.bookTitle}' (ISBN: ${loan.isbn}) to the LibraVerse Circulation Desk.`,
      `DTSTART:${startStr}`,
      `DTEND:${startStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LibraVerse_DueDate_${loan.bookId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Calendar Reminder', `Saved calendar file for "${loan.bookTitle}".`, 'info');
  };

  // Reset demo data
  const resetAllDemoData = () => {
    localStorage.clear();
    setBooks(INITIAL_BOOKS);
    setLoans(INITIAL_LOANS);
    setReservations(INITIAL_RESERVATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWishlist(INITIAL_WISHLIST);
    setReadingGoal(INITIAL_READING_GOAL);
    setSystemConfig(INITIAL_SYSTEM_CONFIG);
    setNotificationPreferences(INITIAL_NOTIFICATION_PREFERENCES);
    setCurrentUser(DEMO_USERS.student);
    setCurrentRoute('student-dashboard');
    showToast('System Reset', 'All demo library data and test patrons have been refreshed.', 'success');
  };

  return (
    <LibraryContext.Provider
      value={{
        currentUser,
        currentRoute,
        setCurrentRoute,
        login,
        logout,
        switchRole,
        books,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBook,
        setSelectedBook,
        loans,
        reservations,
        wishlist,
        borrowBook,
        returnBook,
        renewBook,
        reserveBook,
        cancelReservation,
        toggleWishlist,
        isWishlisted,
        addBook,
        updateBook,
        deleteBook,
        systemConfig,
        updateSystemConfig,
        allUsers,
        updateUserStatus,
        readingGoal,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        notificationPreferences,
        updateNotificationPreferences,
        isScannerOpen,
        setIsScannerOpen,
        isDueReminderOpen,
        setIsDueReminderOpen,
        isAskLibrarianOpen,
        setIsAskLibrarianOpen,
        theme,
        toggleTheme,
        downloadMyReportCSV,
        downloadCalendarICS,
        toasts,
        showToast,
        removeToast,
        resetAllDemoData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
