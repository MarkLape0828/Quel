
"use client"; 

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement, ServiceRequest, CalendarEvent, BillingInfo, User } from "@/lib/types";
import { Megaphone, CalendarDays, UserCircle, CreditCard, Wrench, Briefcase, PartyPopper, Construction, CalendarCheck2, Home } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockUserBillingInfo, mockUsers } from '@/lib/mock-data';
import { getServiceRequestsForUser } from '@/app/(main)/service-requests/actions';
import { getAnnouncements } from '@/lib/announcement-actions'; // Import new action

// Mock events data, ideally from a shared service
const MOCK_EVENTS_DATA: CalendarEvent[] = [
  {
    id: "ev1",
    title: "Board Meeting",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    startTime: "19:00",
    category: "meeting",
  },
  {
    id: "ev2",
    title: "Community BBQ",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    startTime: "12:00",
    category: "community",
  },
];

interface QuickStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  linkTo: string;
  linkText: string;
  iconBgColor?: string;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ title, value, icon: Icon, description, linkTo, linkText, iconBgColor = 'bg-primary/10' }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
    <CardContent className="pt-6 flex-grow">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`p-2 sm:p-3 rounded-full ${iconBgColor} mt-1`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg sm:text-xl font-semibold">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </CardContent>
    <CardFooter className="pt-0">
       <Button variant="link" size="sm" asChild className="px-0 text-primary text-xs">
        <Link href={linkTo}>{linkText} &rarr;</Link>
      </Button>
    </CardFooter>
  </Card>
);

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}
function formatDateDisplay(dateString: string): string {
  return new Date(dateString  + 'T00:00:00').toLocaleDateString('en-US', { // Ensure local timezone by adding T00:00:00
    month: 'short',
    day: 'numeric',
  });
}
const getEventIcon = (category: CalendarEvent['category']) => {
  switch (category) {
    case 'meeting': return Briefcase;
    case 'community': return PartyPopper;
    case 'maintenance': return Construction;
    case 'event': return CalendarCheck2;
    default: return CalendarCheck2;
  }
};

export default function UserDashboardPage() {
  const [userBillingInfo, setUserBillingInfo] = useState<BillingInfo | null>(null);
  const [openServiceRequestsCount, setOpenServiceRequestsCount] = useState(0);
  const [upcomingEvent, setUpcomingEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // MOCK USER ID - In a real app, get this from auth session
  const MOCK_USER_ID = "user123"; 
  const currentUser = mockUsers.find(u => u.id === MOCK_USER_ID) || mockUsers[0];


  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setUserBillingInfo(mockUserBillingInfo); // Mock data

      const requests = await getServiceRequestsForUser(MOCK_USER_ID);
      setOpenServiceRequestsCount(requests.filter(r => r.status === 'pending' || r.status === 'in-progress').length);
      
      const sortedEvents = [...MOCK_EVENTS_DATA]
        .filter(event => new Date(event.date) >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || (a.startTime || "").localeCompare(b.startTime || ""));
      setUpcomingEvent(sortedEvents.length > 0 ? sortedEvents[0] : null);
      
      const fetchedAnnouncements = await getAnnouncements(); // Fetch from new action
      setAnnouncements(fetchedAnnouncements);
      setIsLoading(false);
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground mb-1">Hello, {currentUser.firstName}!</h1>
        <p className="text-muted-foreground mb-6">Welcome to your dashboard. Here's a quick overview.</p>
        {isLoading ? (
           <div className="grid md:grid-cols-3 gap-4 animate-pulse">
             {[1,2,3].map(i => <Card key={i} className="shadow-md"><CardContent className="pt-6"><div className="h-24 bg-muted rounded"></div></CardContent></Card>)}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userBillingInfo && (
              <QuickStatCard 
                title="Next Payment"
                value={formatCurrency(userBillingInfo.monthlyPayment)}
                icon={CreditCard}
                description={`Due: ${formatDateDisplay(userBillingInfo.nextDueDate)}`}
                linkTo="/billing"
                linkText="View Billing Details"
              />
            )}
            {upcomingEvent && (
               <QuickStatCard 
                title="Next Event"
                value={upcomingEvent.title}
                icon={getEventIcon(upcomingEvent.category)}
                description={`${formatDateDisplay(upcomingEvent.date)} ${upcomingEvent.startTime ? `at ${upcomingEvent.startTime}` : ''}`}
                linkTo="/event-calendar"
                linkText="View Full Calendar"
              />
            )}
            <QuickStatCard 
              title="Open Requests"
              value={openServiceRequestsCount}
              icon={Wrench}
              description={openServiceRequestsCount > 0 ? "Active service requests" : "No open requests"}
              linkTo="/service-requests"
              linkText="Manage My Requests"
            />
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Community Feed</h2>
        {isLoading && announcements.length === 0 && <p className="text-muted-foreground">Loading announcements...</p>}
        {!isLoading && announcements.length === 0 && <p className="text-muted-foreground">No announcements at the moment.</p>}
        <div className="space-y-6">
          {announcements.slice(0, 3).map((item) => ( // Show latest 3
            <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                <Badge variant={item.type === "event" ? "default" : "secondary"} className="capitalize text-xs">
                  {item.type === "event" ? <CalendarDays className="mr-1 h-3.5 w-3.5" /> : <Megaphone className="mr-1 h-3.5 w-3.5" />}
                  {item.type}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.content}</p>
                {item.type === 'event' && item.imageUrl && (
                    <Image 
                        src={item.imageUrl} 
                        alt={item.title} 
                        width={600} 
                        height={200} 
                        className="rounded-md object-cover aspect-[3/1]"
                        data-ai-hint={item.aiHint || "community event"}
                    />
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex justify-between pt-3 border-t">
                <span>Posted: {new Date(item.date + 'T00:00:00').toLocaleDateString()}</span>
                {item.author && (
                  <div className="flex items-center">
                    <UserCircle className="h-3.5 w-3.5 mr-1" />
                    <span>{item.author}</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
         {announcements.length > 3 && (
            <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                    <Link href="/notifications">View All Announcements & Notifications</Link>
                </Button>
            </div>
        )}
      </section>
    </div>
  );
}
