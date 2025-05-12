import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  CalendarDays,
  CreditCard, 
  Users, 
  ShieldCheck, // Replaced Home with ShieldCheck for Admin root
  ClipboardList, // For Admin Service Requests
  FolderKanban, // For Admin Documents
} from 'lucide-react';

export const APP_NAME = "MyHOA";

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
export const ADMIN_APP_NAME = "MyHOA Admin";

export const ADMIN_NAV_ITEMS: NavItem[] = [
   {
    title: 'Billing Management',
    href: '/admin/billing',
    icon: Users,
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
  '/admin/service-requests': 'Manage Service Requests',
  '/admin/documents': 'Manage Documents',
  // Admin Auth Pages (if separate, otherwise uses main PageTitles)
  '/admin/login': 'Admin Login',
};
