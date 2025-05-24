import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  LineChart,
  Settings,
  CalendarClock,
  HelpCircle,
} from 'lucide-react';

export const APP_NAME = 'FinanceFlow';

export const SIDENAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your finances.',
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: ArrowLeftRight,
    description: 'View and manage your income and expenses.',
  },
  {
    title: 'Budgets',
    href: '/budgets',
    icon: PiggyBank,
    description: 'Set and track your spending budgets.',
  },
  {
    title: 'Recurring',
    href: '/recurring',
    icon: CalendarClock,
    description: 'Manage your recurring payments and income.',
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: LineChart,
    description: 'Analyze your financial trends.',
  },
];

export const SIDENAV_BOTTOM_ITEMS: NavItem[] = [
 {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configure your application settings.',
  },
  {
    title: 'Help & Support',
    href: '/help', // Placeholder, can link to a documentation or support page
    icon: HelpCircle,
    description: 'Get help or contact support.',
    disabled: true, // Example of a disabled item
  },
];

export const DEFAULT_CATEGORIES: Array<Omit<Category, 'id' | 'userId'>> = [
  // Expenses
  { name: 'Food & Dining', icon: 'Utensils', type: 'expense' },
  { name: 'Housing', icon: 'Home', type: 'expense' },
  { name: 'Transportation', icon: 'Car', type: 'expense' },
  { name: 'Utilities', icon: 'Zap', type: 'expense' },
  { name: 'Healthcare', icon: 'HeartPulse', type: 'expense' },
  { name: 'Entertainment', icon: 'Gamepad2', type: 'expense' },
  { name: 'Shopping', icon: 'ShoppingBag', type: 'expense' },
  { name: 'Education', icon: 'BookOpen', type: 'expense' },
  { name: 'Personal Care', icon: 'PersonStanding', type: 'expense' }, // Replaced Tooth with PersonStanding
  { name: 'Travel', icon: 'Plane', type: 'expense' },
  { name: 'Gifts & Donations', icon: 'Gift', type: 'expense' },
  { name: 'Subscriptions', icon: 'Repeat', type: 'expense' },
  { name: 'Other Expense', icon: 'Package', type: 'expense' },
  // Income
  { name: 'Salary', icon: 'Briefcase', type: 'income' },
  { name: 'Freelance', icon: 'Laptop', type: 'income' },
  { name: 'Investment', icon: 'TrendingUp', type: 'income' },
  { name: 'Gifts Received', icon: 'Gift', type: 'income' },
  { name: 'Other Income', icon: 'DollarSign', type: 'income' },
];
