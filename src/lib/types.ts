export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt?: string; // ISO date string
  role?: 'user' | 'admin'; // Example roles
  // Add other user-specific fields here
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spentAmount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RecurringPayment {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string, optional
  nextDueDate: string; // ISO date string
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  icon?: string; // Lucide icon name or SVG path
  type: 'income' | 'expense' | 'shared'; // To differentiate categories
  userId?: string | null; // For user-specific categories, null for default/system categories
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType; // Lucide icon component
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  children?: NavItem[];
}
