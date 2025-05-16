
"use server";

import { z } from "zod";
import { mockAnnouncements, mockUsers } from "./mock-data";
import type { Announcement } from "./types";
import { AnnouncementSchema, type AnnouncementFormValues } from "./schemas/announcement-schema";
import { createNotification } from "./notification-actions";

// Use a mutable store for actions
let announcementsStore: Announcement[] = [...mockAnnouncements];

export async function getAnnouncements(): Promise<Announcement[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve([...announcementsStore].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export async function addAnnouncement(
  values: AnnouncementFormValues,
  adminUserId: string
): Promise<{ success: boolean; message: string; announcement?: Announcement; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = AnnouncementSchema.parse(values);
    const adminUser = mockUsers.find(u => u.id === adminUserId && u.role === 'admin');
    if (!adminUser) {
        return { success: false, message: "Unauthorized: Admin privileges required." };
    }
    
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      ...validatedData,
      date: new Date().toISOString().split('T')[0], // Set current date on creation
      author: validatedData.author || `${adminUser.firstName} ${adminUser.lastName}`, // Default to admin name if no author provided
      imageUrl: validatedData.imageUrl || (validatedData.type === 'event' ? `https://placehold.co/600x200.png` : undefined),
      aiHint: validatedData.aiHint || (validatedData.type === 'event' ? 'community event' : undefined),
    };

    announcementsStore.unshift(newAnnouncement); // Add to the beginning

    // Notify all 'hoa' users
    const hoaUsers = mockUsers.filter(u => u.role === 'hoa');
    for (const user of hoaUsers) {
        await createNotification({
            userId: user.id,
            title: `New ${newAnnouncement.type}: ${newAnnouncement.title}`,
            message: newAnnouncement.content.substring(0, 100) + (newAnnouncement.content.length > 100 ? "..." : ""),
            type: 'announcement',
            link: '/community-feed' // Or a specific announcement page if created
        });
    }

    return { success: true, message: "Announcement added successfully!", announcement: newAnnouncement };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding announcement:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function updateAnnouncement(
  id: string,
  values: AnnouncementFormValues,
  adminUserId: string
): Promise<{ success: boolean; message: string; announcement?: Announcement; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = AnnouncementSchema.parse(values);
    const adminUser = mockUsers.find(u => u.id === adminUserId && u.role === 'admin');
     if (!adminUser) {
        return { success: false, message: "Unauthorized: Admin privileges required." };
    }

    const announcementIndex = announcementsStore.findIndex(c => c.id === id);

    if (announcementIndex === -1) {
      return { success: false, message: "Announcement not found." };
    }

    const originalAnnouncement = announcementsStore[announcementIndex];
    announcementsStore[announcementIndex] = {
      ...originalAnnouncement, // Preserve original date and ID
      ...validatedData, // Apply updates
      author: validatedData.author || originalAnnouncement.author, // Keep original author if not changed
      imageUrl: validatedData.imageUrl || (validatedData.type === 'event' ? originalAnnouncement.imageUrl || `https://placehold.co/600x200.png` : undefined),
      aiHint: validatedData.aiHint || (validatedData.type === 'event' ? originalAnnouncement.aiHint || 'community event' : undefined),
    };
    
    return { success: true, message: "Announcement updated successfully.", announcement: announcementsStore[announcementIndex] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error updating announcement:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteAnnouncement(
  id: string,
  adminUserId: string
): Promise<{ success: boolean; message: string }> {
  const adminUser = mockUsers.find(u => u.id === adminUserId && u.role === 'admin');
  if (!adminUser) {
    return { success: false, message: "Unauthorized: Admin privileges required." };
  }
  const initialLength = announcementsStore.length;
  announcementsStore = announcementsStore.filter(c => c.id !== id);

  if (announcementsStore.length < initialLength) {
    return { success: true, message: "Announcement deleted successfully." };
  } else {
    return { success: false, message: "Announcement not found." };
  }
}
