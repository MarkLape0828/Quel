"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Notification } from '@/lib/types';
import { getNotificationsForUser } from '@/lib/notification-actions';
import { NotificationList } from './notification-list';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationBellProps {
  userId: string; // Current logged-in user's ID
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const userNotifications = await getNotificationsForUser(userId);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Potentially set an error state to show in UI
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [fetchNotifications, userId]);
  
  // Re-fetch notifications when popover opens to get latest state
  useEffect(() => {
    if (isPopoverOpen && userId) {
      fetchNotifications();
    }
  }, [isPopoverOpen, fetchNotifications, userId]);


  const handleNotificationUpdate = () => {
    // This function is called by NotificationList when a notification is marked read
    // or all are marked read, to re-calculate unread count and potentially re-fetch.
    fetchNotifications();
  };

  if (!userId) return null; // Don't render if no user ID

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {isLoading ? (
            <Skeleton className="absolute -top-1 -right-1 h-3 w-3 rounded-full" />
          ) : unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          userId={userId}
          onNotificationUpdate={handleNotificationUpdate}
        />
      </PopoverContent>
    </Popover>
  );
}