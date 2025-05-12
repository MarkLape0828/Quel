import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockAdminBillingList } from "@/lib/mock-data";
import type { BillingInfo } from "@/lib/types";
import { Users, Home, DollarSign, BarChartHorizontalBig } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminBillingPage() {
  const billingList: BillingInfo[] = mockAdminBillingList;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" /> Billing Management</CardTitle>
          <CardDescription>Overview of all resident billing information and payment progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {billingList.length === 0 ? (
            <p className="text-muted-foreground">No billing information available for any users.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead><Home className="inline-block mr-1 h-4 w-4" />Property</TableHead>
                  <TableHead className="text-right"><DollarSign className="inline-block mr-1 h-4 w-4" />Monthly Payment</TableHead>
                  <TableHead className="text-center"><BarChartHorizontalBig className="inline-block mr-1 h-4 w-4" />Progress</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingList.map((billingInfo) => {
                  const remainingBalance = billingInfo.paymentHistory.length > 0
                    ? billingInfo.paymentHistory[billingInfo.paymentHistory.length - 1].remainingBalance
                    : billingInfo.loanAmount;
                  const progressPercentage = (billingInfo.paymentsMade / billingInfo.totalPayments) * 100;
                  
                  // Simplified status - can be enhanced
                  const isOverdue = new Date(billingInfo.nextDueDate) < new Date() && billingInfo.paymentsMade < billingInfo.totalPayments;

                  return (
                    <TableRow key={billingInfo.id}>
                      <TableCell className="font-medium">{billingInfo.userName || billingInfo.userId}</TableCell>
                      <TableCell>{billingInfo.propertyAddress}</TableCell>
                      <TableCell className="text-right">{formatCurrency(billingInfo.monthlyPayment)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                           <Progress value={progressPercentage} className="w-full h-2 mb-1" />
                           <span className="text-xs text-muted-foreground">
                               {billingInfo.paymentsMade} / {billingInfo.totalPayments}
                           </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(remainingBalance)}</TableCell>
                      <TableCell className="text-center">
                        {billingInfo.paymentsMade === billingInfo.totalPayments ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Paid Off</Badge>
                        ) : isOverdue ? (
                            <Badge variant="destructive">Overdue</Badge>
                        ) : (
                            <Badge variant="secondary">On Track</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
