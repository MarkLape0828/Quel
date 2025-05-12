import type { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  Wrench,
  CalendarDays,
  Sparkles,
  Home,
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
    title: 'AI Document Assistant',
    href: '/ai-assistant',
    icon: Sparkles,
  },
];

export const PageTitles: Record<string, string> = {
  '/community-feed': 'Community Feed',
  '/documents': 'Document Repository',
  '/service-requests': 'Service Requests',
  '/event-calendar': 'Event Calendar',
  '/ai-assistant': 'AI Document Assistant',
};
