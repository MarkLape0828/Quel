
"use server";

import type { Notification, NotificationType } from "./types";
import { mockUsers } from "./mock-data"; // To get user details if needed

// In-memory store for mock notifications
let mockNotifications: Notification[] = [
  {
    id: "notif1",
    userId: "user123", // Alice Member
    title: "New Guideline Uploaded",
    message: "The 'HOA Guidelines Rev. 2024' document has been updated.",
    type: "document_comment",
    link: "/documents",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "notif2",
    userId: "user123",
    title: "Payment Due Soon",
    message: "Your monthly HOA payment is due in 3 days.",
    type: "billing",
    link: "/billing",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "notif3",
    userId: "user456", // Bob Homeowner
    title: "Service Request Updated",
    message: "Your request 'Streetlight out on Elm Street' is now In Progress.",
    type: "service_request",
    link: "/service-requests",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
    {
    id: "notif-admin-1",
    userId: "admin001", 
    title: "New User Registered",
    message: "A new user, 'test@example.com', has registered.",
    type: "general",
    link: "/admin/user-management",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
];

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(
    [...mockNotifications]
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}

export async function createNotification(payload: {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}): Promise<{ success: boolean; notification?: Notification; message?: string }> {
  try {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      ...payload,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    mockNotifications.unshift(newNotification); // Add to the beginning
    console.log("Notification created:", newNotification);
    return { success: true, notification: newNotification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, message: "Failed to create notification." };
  }
}

export async function markNotificationAsRead(notificationId: string, userId: string): Promise<{ success: boolean; message?: string }> {
  const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId && n.userId === userId);
  if (notificationIndex > -1) {
    mockNotifications[notificationIndex].isRead = true;
    console.log("Notification marked as read:", notificationId);
    return { success: true };
  }
  return { success: false, message: "Notification not found or access denied." };
}

export async function markAllNotificationsAsRead(userId: string): Promise<{ success: boolean; message?: string }> {
    let updatedCount = 0;
    mockNotifications.forEach(notification => {
        if (notification.userId === userId && !notification.isRead) {
            notification.isRead = true;
            updatedCount++;
        }
    });
    if (updatedCount > 0) {
        console.log(`Marked ${updatedCount} notifications as read for user ${userId}`);
        return { success: true, message: `${updatedCount} notifications marked as read.` };
    }
    return { success: false, message: "No unread notifications to mark." };
}

// Action for admin to send a billing reminder
export async function sendBillingReminder(
    targetUserId: string, 
    billingInfo: { propertyAddress: string; monthlyPayment: number; nextDueDate: string }
): Promise<{ success: boolean; message: string }> {
    
    const user = mockUsers.find(u => u.id === targetUserId);
    if (!user) {
        return { success: false, message: "Target user not found." };
    }

    const reminderResult = await createNotification({
        userId: targetUserId,
        title: "Friendly Payment Reminder",
        message: `A friendly reminder that your payment of $${billingInfo.monthlyPayment.toFixed(2)} for ${billingInfo.propertyAddress} is due on ${new Date(billingInfo.nextDueDate).toLocaleDateString()}.`,
        type: "billing",
        link: "/billing",
    });

    if (reminderResult.success) {
        return { success: true, message: `Reminder sent to ${user.firstName} ${user.lastName}.` };
    } else {
        return { success: false, message: `Failed to send reminder to ${user.firstName} ${user.lastName}.` };
    }
}
