
import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard, // General Dashboard icon
  FileText,
  Wrench,
  CalendarDays,
  CreditCard,
  Users as BillingUsersIcon, // For Admin Billing specific
  ShieldCheck,
  ClipboardList,
  FolderKanban,
  UserCog, 
  IdCard,
  BookUser, 
  ListChecks, 
  Home as UserHomeIcon, // For User Dashboard
  CarFront, // For Vehicle Registration
  Contact, // For Visitor Passes
  Car, // Admin Vehicle Management
  Users2, // Admin Visitor Pass Management
  Megaphone, // For Announcements Management
} from 'lucide-react';

export const APP_NAME = "The Quel";

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'My Dashboard',
    href: '/community-feed',
    icon: UserHomeIcon, 
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
    title: 'Visitor Passes',
    href: '/visitor-passes',
    icon: Contact,
  },
  {
    title: 'Vehicle Registration',
    href: '/vehicle-registration',
    icon: CarFront,
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
  '/community-feed': 'My Dashboard', 
  '/documents': 'Document Repository',
  '/service-requests': 'Service Requests',
  '/event-calendar': 'Event Calendar',
  '/billing': 'My Billing',
  '/visitor-passes': 'Visitor Passes',
  '/vehicle-registration': 'Vehicle Registration',
  '/contact-directory': 'Contact Directory',
  '/profile': 'My Profile',
  '/notifications': 'Notifications',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password',
};

// Admin constants
export const ADMIN_APP_NAME = "The Quel Admin";

export const ADMIN_NAV_ITEMS: NavItem[] = [
   {
    title: 'Admin Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard, 
  },
   {
    title: 'Billing Management',
    href: '/admin/billing',
    icon: BillingUsersIcon,
  },
  {
    title: 'User Management',
    href: '/admin/user-management',
    icon: UserCog,
  },
  {
    title: 'Manage Announcements',
    href: '/admin/announcements',
    icon: Megaphone,
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
    title: 'Visitor Passes',
    href: '/admin/visitor-passes',
    icon: Users2,
  },
  {
    title: 'Vehicle Registrations',
    href: '/admin/vehicle-registrations',
    icon: Car,
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
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/billing': 'Billing Management',
  '/admin/user-management': 'User Management',
  '/admin/announcements': 'Manage Announcements',
  '/admin/service-requests': 'Manage Service Requests',
  '/admin/documents': 'Manage Documents',
  '/admin/visitor-passes': 'Manage Visitor Passes',
  '/admin/vehicle-registrations': 'Manage Vehicle Registrations',
  '/admin/contact-directory': 'Manage Contact Directory',
  '/admin/profile': 'My Admin Profile',
  '/admin/notifications': 'Admin Notifications', 
  '/admin/login': 'Admin Login',
};
