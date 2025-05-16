
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, FolderKanban, AlertTriangle } from "lucide-react";
import { mockUsers, mockDocuments, mockAdminBillingList } from '@/lib/mock-data';
import { getAllServiceRequests } from '@/app/(main)/service-requests/actions';
import type { ServiceRequest } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColorClass?: string;
  textColorClass?: string;
  description?: string;
  linkTo?: string;
  linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, bgColorClass = 'bg-card', textColorClass = 'text-primary', description, linkTo, linkText }) => (
  <Card className={`shadow-lg ${bgColorClass} hover:shadow-xl transition-shadow`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${textColorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      {linkTo && linkText && (
        <Button variant="link" asChild className="px-0 pt-2 text-xs">
          <Link href={linkTo}>{linkText} &rarr;</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [openServiceRequests, setOpenServiceRequests] = useState(0);
  const [totalDocs, setTotalDocs] = useState(0);
  const [overdueBillings, setOverdueBillings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setTotalUsers(mockUsers.length);
      setTotalDocs(mockDocuments.length);

      const allRequests = await getAllServiceRequests();
      setOpenServiceRequests(allRequests.filter(r => r.status === 'pending' || r.status === 'in-progress').length);
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const overdueCount = mockAdminBillingList.filter(b => {
        const dueDate = new Date(b.nextDueDate + 'T00:00:00');
        const isPaidOff = b.paymentsMade >= b.totalPayments;
        return !isPaidOff && dueDate < today;
      }).length;
      setOverdueBillings(overdueCount);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <Card key={i} className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-5 w-5 bg-muted rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={totalUsers} 
          icon={Users}
          bgColorClass="bg-primary/5"
          linkTo="/admin/user-management"
          linkText="Manage Users"
        />
        <StatCard 
          title="Open Service Requests" 
          value={openServiceRequests} 
          icon={ClipboardList} 
          bgColorClass="bg-primary/5"
          description={openServiceRequests > 0 ? `${openServiceRequests} needs attention` : "All clear"}
          linkTo="/admin/service-requests"
          linkText="View Requests"
        />
        <StatCard 
          title="Total Documents" 
          value={totalDocs} 
          icon={FolderKanban}
          bgColorClass="bg-primary/5"
          linkTo="/admin/documents"
          linkText="Manage Documents"
        />
        <StatCard 
          title="Overdue Billings" 
          value={overdueBillings} 
          icon={AlertTriangle} 
          bgColorClass={overdueBillings > 0 ? "bg-destructive/10" : "bg-primary/5"}
          textColorClass={overdueBillings > 0 ? "text-destructive" : "text-green-500"}
          description={overdueBillings > 0 ? `${overdueBillings} accounts require follow-up` : "All accounts up-to-date"}
          linkTo="/admin/billing"
          linkText="View Billings"
        />
      </div>
      {/* Further sections for charts or detailed tables can be added here */}
    </div>
  );
}

