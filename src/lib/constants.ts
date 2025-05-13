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
  UserCog, 
  LogOut, 
  IdCard,
  BookUser, // For admin manage contacts
  ListChecks, // For user contact directory
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
  {
    title: 'Contact Directory',
    href: '/contact-directory',
    icon: ListChecks,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: IdCard,
  },
];

export const PageTitles: Record<string, string> = {
  '/community-feed': 'Community Feed',
  '/documents': 'Document Repository',
  '/service-requests': 'Service Requests',
  '/event-calendar': 'Event Calendar',
  '/billing': 'My Billing',
  '/contact-directory': 'Contact Directory',
  '/profile': 'My Profile',
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
    icon: Users,
  },
  {
    title: 'User Management',
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
  {
    title: 'Manage Contacts',
    href: '/admin/contact-directory',
    icon: BookUser,
  },
  {
    title: 'My Profile',
    href: '/admin/profile',
    icon: IdCard,
  },
];

export const AdminPageTitles: Record<string, string> = {
  '/admin/billing': 'Billing Management',
  '/admin/user-management': 'User Management',
  '/admin/service-requests': 'Manage Service Requests',
  '/admin/documents': 'Manage Documents',
  '/admin/contact-directory': 'Manage Contact Directory',
  '/admin/profile': 'My Admin Profile',
  // Admin Auth Pages (if separate, otherwise uses main PageTitles)
  '/admin/login': 'Admin Login',
};