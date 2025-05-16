
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUserBillingInfo } from "@/lib/mock-data";
import type { BillingInfo, PaymentHistoryEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CalendarDays, TrendingUp, BarChartBig, Home } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BillingPage() {
  const billingInfo: BillingInfo = mockUserBillingInfo;
  const remainingBalance = billingInfo.paymentHistory.length > 0 
    ? billingInfo.paymentHistory[billingInfo.paymentHistory.length - 1].remainingBalance 
    : billingInfo.loanAmount;

  const paymentsRemaining = billingInfo.totalPayments - billingInfo.paymentsMade;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary" /> My Billing Overview</CardTitle>
          <CardDescription>Manage your property billing, view amortization, and payment history.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-secondary/30">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center"><Home className="mr-1.5 h-4 w-4 text-muted-foreground"/> Property</CardDescription>
                <CardTitle className="text-lg">{billingInfo.propertyAddress}</CardTitle>
              </CardHeader>
            </Card>
             <Card className="bg-secondary/30">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center"><DollarSign className="mr-1.5 h-4 w-4 text-muted-foreground"/> Monthly Payment</CardDescription>
                <CardTitle className="text-2xl font-bold">{formatCurrency(billingInfo.monthlyPayment)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-secondary/30">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground"/> Next Due Date</CardDescription>
                <CardTitle className="text-lg">{formatDate(billingInfo.nextDueDate)}</CardTitle>
              </CardHeader>
            </Card>
             <Card className="bg-secondary/30">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center"><TrendingUp className="mr-1.5 h-4 w-4 text-muted-foreground"/> Remaining Balance</CardDescription>
                <CardTitle className="text-lg">{formatCurrency(remainingBalance)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-secondary/30 col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center"><BarChartBig className="mr-1.5 h-4 w-4 text-muted-foreground"/>Loan Progress</CardDescription>
                    <CardTitle className="text-lg">
                        {billingInfo.paymentsMade} of {billingInfo.totalPayments} payments made ({paymentsRemaining} months left)
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <Progress value={(billingInfo.paymentsMade / billingInfo.totalPayments) * 100} className="w-full h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Start</span>
                        <span>End ({billingInfo.loanTermYears} years)</span>
                    </div>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Detailed record of your past payments.</CardDescription>
        </CardHeader>
        <CardContent>
          {billingInfo.paymentHistory.length === 0 ? (
            <p className="text-muted-foreground">No payment history available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Amount Paid</TableHead>
                  <TableHead className="text-right">Principal Paid</TableHead>
                  <TableHead className="text-right">Interest Paid</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingInfo.paymentHistory.slice().reverse().map((payment: PaymentHistoryEntry) => ( // Show most recent first
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.amountPaid)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.principalPaid)}</TableCell>
                    <TableCell className="text-right text-destructive/80">{formatCurrency(payment.interestPaid)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.remainingBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {billingInfo.paymentHistory.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Showing {billingInfo.paymentHistory.length} payment records.</p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

// Helper icon, as DollarSign is used for Monthly Payment
const DollarSign = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
