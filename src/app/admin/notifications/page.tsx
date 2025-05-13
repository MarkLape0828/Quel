"use client";
// This page is largely a copy of the user notifications page,
// but targets the admin's user ID and potentially could have admin-specific actions.

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import type { Notification } from "@/lib/types";
import { getNotificationsForUser, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notification-actions";
import { Button } from '@/components/ui/button';
import { CheckCheck, BellRing, ShieldAlert, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Megaphone, FileText, Wrench, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const getIconForType = (type: Notification['type']) => {
  switch (type) {
    case 'billing': return <DollarSign className="h-5 w-5 text-green-500" />;
    case 'announcement': return <Megaphone className="h-5 w-5 text-blue-500" />;
    case 'service_request': return <Wrench className="h-5 w-5 text-orange-500" />;
    case 'document_comment': return <FileText className="h-5 w-5 text-purple-500" />;
    case 'general': return <Info className="h-5 w-5 text-gray-500" />;
    default: return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export default function AdminNotificationsPage() {
  // MOCK ADMIN USER ID - In a real app, get this from auth session
  const currentAdminId = "admin001"; 
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!currentAdminId) return;
    setIsLoading(true);
    try {
      const adminNotifications = await getNotificationsForUser(currentAdminId);
      setNotifications(adminNotifications);
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
      toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [currentAdminId, toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id, currentAdminId);
      fetchNotifications(); 
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsAsRead(currentAdminId);
    if (result.success) {
        toast({ title: "Success", description: result.message });
    } else {
        toast({ title: "Info", description: result.message || "No unread notifications.", variant: "default" });
    }
    fetchNotifications();
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-6 w-6 text-primary" /> Admin Notifications</CardTitle>
            <CardDescription>System alerts and important updates for administrators.</CardDescription>
          </div>
          {unreadCount > 0 && (
             <Button onClick={handleMarkAllRead} variant="outline" size="sm">
              <CheckCheck className="mr-2 h-4 w-4"/> Mark All as Read ({unreadCount})
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <BellRing className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no admin notifications at the moment.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-4 border rounded-lg hover:shadow-md transition-shadow flex items-start space-x-3
                                ${notification.isRead ? 'bg-card hover:bg-muted/50 opacity-80' : 'bg-primary/5 hover:bg-primary/10 font-medium'}`}
                  >
                    <span className="mt-1 text-primary">{getIconForType(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                         <h5 className={`text-sm ${notification.isRead ? 'text-muted-foreground font-normal' : 'text-foreground font-semibold'}`}>{notification.title}</h5>
                         {!notification.isRead && <Badge variant="default" className="h-2 w-2 p-0 rounded-full shrink-0" />}
                      </div>
                      <p className={`text-xs mt-0.5 ${notification.isRead ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        {notifications.length > 0 && (
            <CardFooter className="justify-start">
                <p className="text-xs text-muted-foreground">Displaying {notifications.length} admin notifications.</p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}