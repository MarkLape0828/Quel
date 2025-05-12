import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  CalendarDays,
  DollarSign, // Changed from Sparkles
  Users, // Added for Admin
  Home,
  CreditCard, // Added for user Billing
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
    title: 'Billing', // Added
    href: '/billing', // Added
    icon: CreditCard, // Added
  },
  // Removed AI Document Assistant
];

export const PageTitles: Record<string, string> = {
  '/community-feed': 'Community Feed',
  '/documents': 'Document Repository',
  '/service-requests': 'Service Requests',
  '/event-calendar': 'Event Calendar',
  '/billing': 'My Billing', // Added
};

// Admin constants
export const ADMIN_APP_NAME = "MyHOA Admin";

export const ADMIN_NAV_ITEMS: NavItem[] = [
   {
    title: 'Billing Management',
    href: '/admin/billing',
    icon: Users,
  },
  // Add other admin navigation items here
];

export const AdminPageTitles: Record<string, string> = {
  '/admin/billing': 'Billing Management',
  // Add other admin page titles here
};
