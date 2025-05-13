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

export interface Comment {
  id: string;
  documentId: string;
  userId: string; // ID of the user who made the comment
  userName: string; // Name of the user for display
  text: string;
  date: string; // ISO string format
  attachmentUrl?: string; // URL to the attached file
  attachmentName?: string; // Name of the attached file
}

export interface DocumentItem {
  id: string;
  name: string;
  url: string; // Could be a download link or path to a file
  type: 'guideline' | 'minutes' | 'form' | 'report' | 'user-specific';
  uploadDate: string;
  size?: string;
  userId: string; // ID of the user this document belongs to or 'hoa_general' for HOA wide documents
  uploadedBy: 'admin' | 'user' | 'system'; // Who uploaded it
  comments: Comment[];
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
  submittedBy?: string; // User ID or name
  assignedTo?: string; // Admin ID or name for tracking
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

export interface PaymentHistoryEntry {
  id: string;
  paymentDate: string; // YYYY-MM-DD
  amountPaid: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface BillingInfo {
  id: string; // Unique ID for the billing record
  userId: string; // Link to a user
  userName?: string; // Optional, for display
  propertyAddress: string;
  loanAmount: number;
  interestRate: number; // Annual percentage rate, e.g., 5.5 for 5.5%
  loanTermYears: number;
  monthlyPayment: number;
  paymentsMade: number; // Number of payments made
  totalPayments: number; // loanTermYears * 12
  nextDueDate: string; // YYYY-MM-DD
  paymentHistory: PaymentHistoryEntry[];
}

// Auth related types
export type UserRole = 'hoa' | 'admin' | 'staff' | 'utility';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  isArchived?: boolean; 
  propertyId?: string; 
  propertyAddress?: string; 
}

// Contact Directory Types
export interface SocialMediaLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'website' | string; // string for other custom platforms
  url: string;
  displayText?: string; // Optional: "Follow us on Facebook" vs just "Facebook"
}
export interface DirectoryContact {
  id: string;
  name: string; // e.g., "HOA Office", "Security Guard Post"
  department: string; // e.g., "Administration", "Security", "Maintenance"
  phoneNumber?: string;
  email?: string;
  socialMediaLinks?: SocialMediaLink[];
  notes?: string; // e.g., "Office Hours: Mon-Fri 9 AM - 5 PM"
}

// Notification System Types
export type NotificationType = 'billing' | 'announcement' | 'service_request' | 'document_comment' | 'general';

export interface Notification {
  id: string;
  userId: string; // ID of the user this notification is for
  title: string;
  message: string;
  type: NotificationType;
  link?: string; // Optional link to navigate to when clicked
  isRead: boolean;
  createdAt: string; // ISO string format
}
