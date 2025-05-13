import type { BillingInfo, PaymentHistoryEntry, DocumentItem, User, UserRole, Comment, DirectoryContact } from './types';

const calculateMonthlyPayment = (loanAmount: number, annualInterestRate: number, loanTermYears: number): number => {
  if (annualInterestRate === 0) {
    return loanAmount / (loanTermYears * 12);
  }
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const payment =
    loanAmount *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  return parseFloat(payment.toFixed(2));
};

const generatePaymentHistory = (
  loanAmount: number,
  annualInterestRate: number,
  monthlyPayment: number,
  paymentsMade: number,
  startDate: string // YYYY-MM-DD
): { history: PaymentHistoryEntry[], remainingBalance: number } => {
  const history: PaymentHistoryEntry[] = [];
  let balance = loanAmount;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  let currentDate = new Date(startDate);

  for (let i = 0; i < paymentsMade; i++) {
    const interestPaid = parseFloat((balance * monthlyInterestRate).toFixed(2));
    const principalPaid = parseFloat((monthlyPayment - interestPaid).toFixed(2));
    balance = parseFloat((balance - principalPaid).toFixed(2));
    if (balance < 0) balance = 0; // Ensure balance doesn't go negative due to rounding

    history.push({
      id: `payment-${i + 1}`,
      paymentDate: currentDate.toISOString().split('T')[0],
      amountPaid: monthlyPayment,
      principalPaid: principalPaid,
      interestPaid: interestPaid,
      remainingBalance: balance,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return { history, remainingBalance: balance };
};


const user1LoanAmount = 250000;
const user1InterestRate = 3.5;
const user1LoanTermYears = 30;
const user1MonthlyPayment = calculateMonthlyPayment(user1LoanAmount, user1InterestRate, user1LoanTermYears);
const user1PaymentsMade = 60; // 5 years
const user1PaymentStartDate = "2019-07-01";
const { history: user1PaymentHistory } = generatePaymentHistory(
  user1LoanAmount,
  user1InterestRate,
  user1MonthlyPayment,
  user1PaymentsMade,
  user1PaymentStartDate
);
const user1NextDueDate = new Date(user1PaymentStartDate);
user1NextDueDate.setMonth(user1NextDueDate.getMonth() + user1PaymentsMade);


export const mockUserBillingInfo: BillingInfo = {
  id: 'billing-user123', 
  userId: 'user123',
  userName: 'Alice Member', 
  propertyAddress: '123 Main St, Anytown, USA',
  loanAmount: user1LoanAmount,
  interestRate: user1InterestRate,
  loanTermYears: user1LoanTermYears,
  monthlyPayment: user1MonthlyPayment,
  paymentsMade: user1PaymentsMade,
  totalPayments: user1LoanTermYears * 12,
  nextDueDate: user1NextDueDate.toISOString().split('T')[0],
  paymentHistory: user1PaymentHistory,
};


const user2LoanAmount = 180000;
const user2InterestRate = 4.1;
const user2LoanTermYears = 15;
const user2MonthlyPayment = calculateMonthlyPayment(user2LoanAmount, user2InterestRate, user2LoanTermYears);
const user2PaymentsMade = 24; // 2 years
const user2PaymentStartDate = "2022-07-01";
const { history: user2PaymentHistory } = generatePaymentHistory(
  user2LoanAmount,
  user2InterestRate,
  user2MonthlyPayment,
  user2PaymentsMade,
  user2PaymentStartDate
);
const user2NextDueDate = new Date(user2PaymentStartDate);
user2NextDueDate.setMonth(user2NextDueDate.getMonth() + user2PaymentsMade);


const adminUser1Billing: BillingInfo = { ...mockUserBillingInfo };

const adminUser2Billing: BillingInfo = {
  id: 'billing-user456', 
  userId: 'user456',
  userName: 'Bob Homeowner', 
  propertyAddress: '456 Oak Ave, Anytown, USA',
  loanAmount: user2LoanAmount,
  interestRate: user2InterestRate,
  loanTermYears: user2LoanTermYears,
  monthlyPayment: user2MonthlyPayment,
  paymentsMade: user2PaymentsMade,
  totalPayments: user2LoanTermYears * 12,
  nextDueDate: user2NextDueDate.toISOString().split('T')[0],
  paymentHistory: user2PaymentHistory,
};

export const mockAdminBillingList: BillingInfo[] = [
  adminUser1Billing,
  adminUser2Billing,
  {
    id: 'billing-admin001', 
    userId: 'admin001',
    userName: 'Site Admin',
    propertyAddress: '789 Pine Ln, Admin City, USA',
    loanAmount: 320000,
    interestRate: 3.8,
    loanTermYears: 30,
    monthlyPayment: calculateMonthlyPayment(320000, 3.8, 30),
    paymentsMade: 12,
    totalPayments: 30 * 12,
    nextDueDate: '2025-08-01',
    paymentHistory: generatePaymentHistory(320000, 3.8, calculateMonthlyPayment(320000, 3.8, 30), 12, "2023-07-01").history,
  }
];

export let mockDocuments: DocumentItem[] = [
  {
    id: "doc-guidelines-2024",
    name: "HOA Guidelines Rev. 2024",
    url: "/documents/hoa-guidelines-2024.pdf",
    type: "guideline",
    uploadDate: "2024-01-15",
    size: "1.2 MB",
    userId: "hoa_general",
    uploadedBy: "admin",
    comments: [
      {
        id: "comment-1",
        documentId: "doc-guidelines-2024",
        userId: "user123",
        userName: "Alice Member",
        text: "Thanks for the update! Are there any changes to the pet policy?",
        date: "2024-01-20T10:30:00Z",
      },
      {
        id: "comment-2",
        documentId: "doc-guidelines-2024",
        userId: "admin001",
        userName: "Site Admin",
        text: "Hi Alice, the pet policy remains the same as in the 2023 version. See page 12.",
        date: "2024-01-20T11:00:00Z",
        attachmentUrl: "/attachments/mock-pet-policy-excerpt.pdf",
        attachmentName: "pet-policy-excerpt.pdf"
      }
    ],
  },
  {
    id: "doc-minutes-may-2024",
    name: "Meeting Minutes - May 2024",
    url: "/documents/meeting-minutes-may-2024.pdf",
    type: "minutes",
    uploadDate: "2024-06-01",
    size: "350 KB",
    userId: "hoa_general",
    uploadedBy: "admin",
    comments: [],
  },
  {
    id: "doc-arc-form",
    name: "Architectural Change Request Form",
    url: "/documents/arc-request-form.pdf",
    type: "form",
    uploadDate: "2023-11-20",
    size: "150 KB",
    userId: "hoa_general",
    uploadedBy: "system",
    comments: [],
  },
  {
    id: "doc-financial-report-2023",
    name: "Annual Financial Report 2023",
    url: "/documents/financial-report-2023.pdf",
    type: "report",
    uploadDate: "2024-03-01",
    size: "2.5 MB",
    userId: "hoa_general",
    uploadedBy: "admin",
    comments: [
      {
        id: "comment-3",
        documentId: "doc-financial-report-2023",
        userId: "user456",
        userName: "Bob Homeowner",
        text: "Could we get a breakdown of the maintenance expenses?",
        date: "2024-03-05T14:00:00Z",
      }
    ],
  },
  {
    id: "doc-user123-lease",
    name: "Lease Agreement - Alice Member",
    url: "/documents/user123-lease.pdf",
    type: "user-specific",
    uploadDate: "2024-07-10",
    size: "750 KB",
    userId: "user123", 
    uploadedBy: "admin",
    comments: [],
  },
  {
    id: "doc-user456-pet-policy",
    name: "Pet Policy Agreement - Bob Homeowner",
    url: "/documents/user456-pet-policy.pdf",
    type: "user-specific",
    uploadDate: "2024-07-11",
    size: "120 KB",
    userId: "user456", 
    uploadedBy: "user",
    comments: [],
  },
];


// Mock Users for User Management
export let mockUsers: User[] = [
  { id: 'admin001', email: 'admin@example.com', firstName: 'Site', lastName: 'Admin', role: 'admin', contactNumber: '555-0100', isArchived: false },
  { id: 'user001', email: 'user@example.com', firstName: 'Regular', lastName: 'User', role: 'hoa', contactNumber: '555-0101', isArchived: false, propertyId: "P101", propertyAddress: "101 Blossom Lane, The Quel" },
  { id: 'user002', email: 'staff@example.com', firstName: 'Jane', lastName: 'Staff', role: 'staff', contactNumber: '555-0102', isArchived: false },
  { id: 'user003', email: 'utility@example.com', firstName: 'Utility', lastName: 'Person', role: 'utility', contactNumber: '555-0103', isArchived: false },
  { id: 'user123', email: 'member1@example.com', firstName: 'Alice', lastName: 'Member', role: 'hoa', contactNumber: '555-0104', isArchived: false, propertyId: "P102", propertyAddress: "123 Main St, Anytown, USA"},
  { id: 'user456', email: 'member2@example.com', firstName: 'Bob', lastName: 'Homeowner', role: 'hoa', contactNumber: '555-0105', isArchived: false, propertyId: "P103", propertyAddress: "456 Oak Ave, Anytown, USA" },
  { id: 'user789', email: 'robert.johnson@example.com', firstName: 'Robert', lastName: 'Johnson', role: 'hoa', contactNumber: '555-0106', isArchived: false, propertyId: "P104", propertyAddress: "789 Pine Rd, The Quel"},
];

export const USER_ROLES: UserRole[] = ['admin', 'hoa', 'staff', 'utility'];

// Mock Contact Directory Data
export let mockDirectoryContacts: DirectoryContact[] = [
  {
    id: "contact-hoa-office",
    name: "The Quel HOA Office",
    department: "Administration",
    phoneNumber: "(555) 100-2000",
    email: "hoaoffice@thequel.com",
    socialMediaLinks: [
      { platform: "website", url: "https://www.thequel.com", displayText: "Official Website"},
      { platform: "facebook", url: "https://facebook.com/thequelhoa" }
    ],
    notes: "Office Hours: Monday - Friday, 9 AM - 5 PM. For general inquiries and community information."
  },
  {
    id: "contact-security",
    name: "The Quel Security Dispatch",
    department: "Security",
    phoneNumber: "(555) 100-2001",
    email: "security@thequel.com",
    notes: "24/7 Dispatch. For emergencies, please dial 911 first."
  },
  {
    id: "contact-maintenance",
    name: "The Quel Maintenance Team",
    department: "Maintenance",
    phoneNumber: "(555) 100-2002",
    email: "maintenance@thequel.com",
    socialMediaLinks: [
      { platform: "twitter", url: "https://twitter.com/thequelmaintenance" }
    ],
    notes: "For common area maintenance requests. Submit service requests via the portal for property-specific issues."
  },
  {
    id: "contact-events",
    name: "Community Events Coordinator",
    department: "Community Engagement",
    email: "events@thequel.com",
    notes: "For information about upcoming community events and hall bookings."
  }
];