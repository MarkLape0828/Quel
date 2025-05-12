import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  CalendarDays,
  CreditCard,
  Users,
  ShieldCheck,
  ClipboardList,
  FolderKanban,
  UserCog, // Added for User Management
  LogOut, // Added for Logout button, though used directly in layouts
} from 'lucide-react';

export const APP_NAME = "The Quel";

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Community Feed',
    href: '/community-feed',
    icon: LayoutDashboard,
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Service Requests',
    href: '/service-requests',
    icon: Wrench,
  },
  {
    title: 'Event Calendar',
    href: '/event-calendar',
    icon: CalendarDays,
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
];

export const PageTitles: Record<string, string> = {
  '/community-feed': 'Community Feed',
  '/documents': 'Document Repository',
  '/service-requests': 'Service Requests',
  '/event-calendar': 'Event Calendar',
  '/billing': 'My Billing',
  // Auth Pages
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password',
};

// Admin constants
export const ADMIN_APP_NAME = "The Quel Admin";

export const ADMIN_NAV_ITEMS: NavItem[] = [
   {
    title: 'Billing Management',
    href: '/admin/billing',
    icon: Users, // Kept Users icon for Billing Management
  },
  {
    title: 'User Management', // New User Management page
    href: '/admin/user-management',
    icon: UserCog,
  },
  {
    title: 'Service Requests',
    href: '/admin/service-requests',
    icon: ClipboardList,
  },
  {
    title: 'Document Management',
    href: '/admin/documents',
    icon: FolderKanban,
  },
];

export const AdminPageTitles: Record<string, string> = {
  '/admin/billing': 'Billing Management',
  '/admin/user-management': 'User Management', // Title for new page
  '/admin/service-requests': 'Manage Service Requests',
  '/admin/documents': 'Manage Documents',
  // Admin Auth Pages (if separate, otherwise uses main PageTitles)
  '/admin/login': 'Admin Login',
};