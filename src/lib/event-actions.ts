
"use server";

import { z } from "zod";
import type { CalendarEvent } from "./types";
import { mockCommunityEvents, mockUserSpecificEvents, mockUsers } from "./mock-data";
import { AddPersonalEventSchema } from "./schemas/event-schema";
import { format } from "date-fns";
import { createNotification } from "./notification-actions";

export async function getCommunityEvents(): Promise<CalendarEvent[]> {
  // In a real app, fetch from a database or API
  return Promise.resolve([...mockCommunityEvents]);
}

export async function getUserSpecificEvents(userId: string): Promise<CalendarEvent[]> {
  return Promise.resolve([...mockUserSpecificEvents].filter(event => event.userId === userId));
}

export async function addUserSpecificEvent(
  userId: string,
  values: z.infer<typeof AddPersonalEventSchema>
): Promise<{ success: boolean; event?: CalendarEvent; message?: string; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = AddPersonalEventSchema.parse(values);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
        return { success: false, message: "User not found." };
    }

    const newEvent: CalendarEvent = {
      id: `user-event-${Date.now()}-${userId}`,
      userId: userId,
      title: validatedData.title,
      date: format(validatedData.date, "yyyy-MM-dd"),
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      description: validatedData.description,
      location: validatedData.location,
      category: "personal", // User-added events are 'personal'
      isUserSpecific: true,
    };

    mockUserSpecificEvents.push(newEvent);
    
    // Optional: Notify user about their own event creation (might be redundant)
    // await createNotification({
    //   userId: userId,
    //   title: "Personal Event Created",
    //   message: `Your event "${newEvent.title}" on ${format(new Date(newEvent.date), "PPP")} has been added to your calendar.`,
    //   type: "event",
    //   link: "/event-calendar"
    // });

    return { success: true, event: newEvent, message: "Personal event added successfully." };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding personal event:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function deleteUserSpecificEvent(eventId: string, userId: string): Promise<{ success: boolean; message?: string }> {
  const eventIndex = mockUserSpecificEvents.findIndex(event => event.id === eventId && event.userId === userId);
  if (eventIndex === -1) {
    return { success: false, message: "Event not found or you do not have permission to delete it." };
  }

  mockUserSpecificEvents.splice(eventIndex, 1);
  return { success: true, message: "Personal event deleted successfully." };
}

// Placeholder for Admin adding community event - can be expanded later
export async function addCommunityEventByAdmin(
    adminUserId: string,
    // Use a similar schema or a dedicated admin schema for community events
    values: Omit<CalendarEvent, 'id' | 'isUserSpecific' | 'userId' | 'category'> & { category: 'event' | 'meeting' | 'maintenance' | 'community' }
): Promise<{ success: boolean; event?: CalendarEvent; message?: string }> {
    const admin = mockUsers.find(u => u.id === adminUserId && u.role === 'admin');
    if (!admin) {
        return { success: false, message: "Unauthorized." };
    }

    // Add validation schema for community event creation if needed

    const newCommunityEvent: CalendarEvent = {
        id: `community-event-${Date.now()}`,
        title: values.title,
        date: values.date, // Ensure date is in correct format
        startTime: values.startTime,
        endTime: values.endTime,
        description: values.description,
        location: values.location,
        category: values.category,
        isUserSpecific: false,
    };
    mockCommunityEvents.push(newCommunityEvent);
    return { success: true, event: newCommunityEvent, message: "Community event added." };
}
