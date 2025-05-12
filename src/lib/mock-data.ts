import type { BillingInfo, PaymentHistoryEntry, DocumentItem } from './types';

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
  id: 'billing-user1',
  userId: 'user123',
  userName: 'John Doe',
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
  id: 'billing-user2',
  userId: 'user456',
  userName: 'Jane Smith',
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
    id: 'billing-user3',
    userId: 'user789',
    userName: 'Robert Johnson',
    propertyAddress: '789 Pine Ln, Anytown, USA',
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
  },
  {
    id: "doc-user123-lease",
    name: "Lease Agreement - John Doe",
    url: "/documents/user123-lease.pdf",
    type: "user-specific",
    uploadDate: "2024-07-10",
    size: "750 KB",
    userId: "user123", // Corresponds to mockUserBillingInfo.userId
    uploadedBy: "admin",
  },
  {
    id: "doc-user456-pet-policy",
    name: "Pet Policy Agreement - Jane Smith",
    url: "/documents/user456-pet-policy.pdf",
    type: "user-specific",
    uploadDate: "2024-07-11",
    size: "120 KB",
    userId: "user456", // Corresponds to adminUser2Billing.userId
    uploadedBy: "user",
  },
];
