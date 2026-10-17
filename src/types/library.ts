export type UserRole = 'student' | 'librarian' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string; // or Employee ID for staff
  role: UserRole;
  department: string;
  year?: string;
  avatarUrl?: string;
  borrowLimit: number;
  activeLoansCount: number;
  joinedDate: string;
  status: 'active' | 'suspended' | 'graduated';
}

export type BookCategory =
  | 'Computer Science & AI'
  | 'Quantum Physics & Math'
  | 'Aerospace & Robotics'
  | 'Biotechnology & Genetics'
  | 'Cybersecurity & Networks'
  | 'Philosophy & Cognitive Sci'
  | 'Economics & Data Analytics'
  | 'Creative Arts & Architecture';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  isbn: string;
  callNumber: string;
  shelfLocation: string; // e.g., "Hall of Cosmos · Tier 3, Row 12"
  totalCopies: number;
  availableCopies: number;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  publishYear: number;
  pages: number;
  publisher: string;
  summary: string;
  tags: string[];
  gradientTheme: string; // CSS gradient for book cover artwork
  accentColor: string; // e.g. '#06b6d4'
  coverBadge?: string; // 'Essential Reading', 'New Arrival', 'Rare Edition'
  waitlist: string[]; // array of userIds
  borrowCount: number;
  featured?: boolean;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  category: BookCategory;
  isbn: string;
  userId: string;
  userName: string;
  userStudentId: string;
  borrowDate: string; // ISO string
  dueDate: string; // ISO string
  returnDate?: string; // ISO string if returned
  renewalsCount: number;
  status: 'active' | 'returned' | 'overdue';
  fineAmount: number; // accumulated fine in dollars
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  isbn: string;
  userId: string;
  userName: string;
  userStudentId: string;
  requestedAt: string;
  status: 'waiting' | 'ready_for_pickup' | 'fulfilled' | 'cancelled';
  queuePosition: number;
  notifiedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'due_date' | 'overdue' | 'reservation' | 'system' | 'recommendation';
  timestamp: string;
  read: boolean;
  actionRoute?: PageRoute;
}

export interface ReadingGoal {
  targetBooks: number;
  completedBooks: number;
  readingStreakDays: number;
  totalReadingMinutes: number;
  weeklyReadingHours: { day: string; hours: number }[];
  categoryDistribution: { category: string; count: number; percentage: number }[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  dueReminderDays: number; // 1, 2, or 3 days prior
  newArrivalAlerts: boolean;
  reservationReadyAlerts: boolean;
}

export interface SystemConfig {
  loanDurationDays: number;
  maxBorrowLimit: number;
  maxRenewalCount: number;
  dailyFineRate: number; // e.g. 0.50
  libraryHours: string;
  academicTerm: string;
  autoApproveRenewals: boolean;
}

export type PageRoute =
  | 'landing'
  | 'login'
  | 'student-dashboard'
  | 'explore'
  | 'my-books'
  | 'wishlist'
  | 'recommendations'
  | 'analytics'
  | 'notifications'
  | 'librarian'
  | 'admin';
