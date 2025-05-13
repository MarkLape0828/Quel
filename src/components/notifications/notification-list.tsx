"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Notification } from '@/lib/types';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/notification-actions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Info, AlertTriangle, DollarSign, Megaphone, FileText, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  userId: string;
  onNotificationUpdate: () => void; // Callback to parent to refresh counts/data
}

const getIconForType = (type: Notification['type']) => {
  switch (type) {
    case 'billing': return <DollarSign className="h-4 w-4 text-green-500" />;
    case 'announcement': return <Megaphone className="h-4 w-4 text-blue-500" />;
    case 'service_request': return <Wrench className="h-4 w-4 text-orange-500" />;
    case 'document_comment': return <FileText className="h-4 w-4 text-purple-500" />;
    case 'general': return <Info className="h-4 w-4 text-gray-500" />;
    default: return <Info className="h-4 w-4 text-gray-500" />;
  }
};

export function NotificationList({ notifications, isLoading, userId, onNotificationUpdate }: NotificationListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id, userId);
      onNotificationUpdate(); // Refresh list in parent
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsAsRead(userId);
    if (result.success) {
        toast({ title: "Success", description: result.message });
    } else {
        toast({ title: "Info", description: result.message || "No unread notifications.", variant: "default" });
    }
    onNotificationUpdate();
  };
  
  const unreadNotificationsExist = notifications.some(n => !n.isRead);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <h4 className="font-semibold text-sm">Notifications</h4>
        {unreadNotificationsExist && (
             <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs">
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Mark all as read
            </Button>
        )}
      </div>
      <ScrollArea className="h-[300px]">
        {isLoading && (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading notifications...</div>
        )}
        {!isLoading && notifications.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</div>
        )}
        {!isLoading && notifications.length > 0 && (
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-3 hover:bg-muted transition-colors ${notification.isRead ? 'opacity-70' : 'font-medium'}`}
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="mt-0.5">{getIconForType(notification.type)}</span>
                    <div className="flex-1">
                      <p className={`text-xs ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>{notification.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                        {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notification.isRead && (
                        <Badge variant="default" className="h-2 w-2 p-0 rounded-full shrink-0" />
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
       <div className="p-2 border-t text-center">
        <Button variant="link" size="sm" className="text-xs" asChild>
          <Link href="/notifications">View all notifications</Link>
        </Button>
      </div>
    </div>
  );
}