export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'announcement' | 'event';
  author?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  url: string; // Could be a download link or path to a file
  type: 'guideline' | 'minutes' | 'form' | 'report';
  uploadDate: string;
  size?: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'security' | 'other';
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  submittedDate: string;
  resolvedDate?: string;
  location?: string;
  submittedBy?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Could be ISO string or Date object
  startTime?: string;
  endTime?: string;
  description?: string;
  category: 'event' | 'meeting' | 'maintenance' | 'community';
  location?: string;
}
