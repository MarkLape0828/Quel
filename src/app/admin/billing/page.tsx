"use client"; 
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added Button
import { mockAdminBillingList } from "@/lib/mock-data";
import type { BillingInfo } from "@/lib/types";
import { Users, Home, DollarSign, BarChartHorizontalBig, Send } from "lucide-react"; // Added Send icon
import { sendBillingReminder } from '@/lib/notification-actions'; // Action to send reminder
import { useToast } from '@/hooks/use-toast'; // For feedback

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminBillingPage() {
  // For a real app, this would be fetched, perhaps with useState and useEffect
  const billingList: BillingInfo[] = mockAdminBillingList;
  const { toast } = useToast();
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  const handleSendReminder = async (billingInfo: BillingInfo) => {
    setSendingReminderId(billingInfo.id);
    try {
      const result = await sendBillingReminder(billingInfo.userId, {
        propertyAddress: billingInfo.propertyAddress,
        monthlyPayment: billingInfo.monthlyPayment,
        nextDueDate: billingInfo.nextDueDate,
      });

      if (result.success) {
        toast({
          title: "Reminder Sent",
          description: result.message,
        });
      } else {
        toast({
          title: "Error Sending Reminder",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending the reminder.",
        variant: "destructive",
      });
    } finally {
      setSendingReminderId(null);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" /> Billing Management</CardTitle>
          <CardDescription>Overview of all resident billing information and payment progress. Send payment reminders.</CardDescription>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingList.map((billingInfo) => {
                  const remainingBalance = billingInfo.paymentHistory.length > 0
                    ? billingInfo.paymentHistory[billingInfo.paymentHistory.length - 1].remainingBalance
                    : billingInfo.loanAmount;
                  const progressPercentage = (billingInfo.paymentsMade / billingInfo.totalPayments) * 100;
                  
                  const isPaidOff = billingInfo.paymentsMade >= billingInfo.totalPayments;
                  const dueDate = new Date(billingInfo.nextDueDate + 'T00:00:00'); // Ensure it's parsed as local, not UTC
                  const today = new Date();
                  today.setHours(0,0,0,0); // Compare dates only
                  const isOverdue = !isPaidOff && dueDate < today;


                  return (
                    <TableRow key={billingInfo.id}>
                      <TableCell className="font-medium">{billingInfo.userName || billingInfo.userId}</TableCell>
                      <TableCell>{billingInfo.propertyAddress}</TableCell>
                      <TableCell className="text-right">{formatCurrency(billingInfo.monthlyPayment)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                           <Progress value={progressPercentage} className="w-full h-2 mb-1" 
                             aria-label={`Loan progress ${progressPercentage.toFixed(0)}%`}
                           />
                           <span className="text-xs text-muted-foreground">
                               {billingInfo.paymentsMade} / {billingInfo.totalPayments}
                           </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(remainingBalance)}</TableCell>
                      <TableCell className="text-center">
                        {isPaidOff ? (
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Paid Off</Badge>
                        ) : isOverdue ? (
                            <Badge variant="destructive">Overdue</Badge>
                        ) : (
                            <Badge variant="secondary" className="text-primary border-primary/50">On Track</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!isPaidOff && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSendReminder(billingInfo)}
                            disabled={sendingReminderId === billingInfo.id}
                          >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            {sendingReminderId === billingInfo.id ? "Sending..." : "Remind"}
                          </Button>
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