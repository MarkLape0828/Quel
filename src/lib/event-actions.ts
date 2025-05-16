
"use server";

import { z } from "zod";
import type { CalendarEvent, Announcement } from "./types"; // Added Announcement type
import { mockCommunityEvents, mockUserSpecificEvents, mockUsers } from "./mock-data";
import { AddPersonalEventSchema } from "./schemas/event-schema";
import { format } from "date-fns";
import { createNotification } from "./notification-actions";
import { getAnnouncements } from "./announcement-actions"; // Import getAnnouncements

export async function getCommunityEvents(): Promise<CalendarEvent[]> {
  // Fetch manually defined community events
  const manualCommunityEvents: CalendarEvent[] = [...mockCommunityEvents];

  // Fetch announcements and filter for those of type 'event'
  const allAnnouncements: Announcement[] = await getAnnouncements();
  const eventAnnouncements: CalendarEvent[] = allAnnouncements
    .filter(ann => ann.type === 'event')
    .map(ann => ({
      id: `ann-event-${ann.id}`, // Create a unique ID for the calendar event
      title: ann.title,
      date: ann.date, // Assuming announcement.date is in "YYYY-MM-DD" format
      // For now, startTime, endTime, location will be undefined for announcement-derived events
      // unless we enhance the Announcement type and form to include these details for events.
      description: ann.content,
      category: 'event', // Or 'community' - standardizing to 'event' for now
      isUserSpecific: false,
      // location: ann.location, // If you add location to Announcement type for events
      // startTime: ann.eventStartTime, // If you add these fields
      // endTime: ann.eventEndTime,
    }));

  // Merge and sort all community events
  const allCommunityEvents = [...manualCommunityEvents, ...eventAnnouncements];
  
  // Sort by date, then by start time (if available)
  allCommunityEvents.sort((a, b) => {
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return (a.startTime || "").localeCompare(b.startTime || "");
  });
  
  return Promise.resolve(allCommunityEvents);
}

export async function getUserSpecificEvents(userId: string): Promise<CalendarEvent[]> {
  return Promise.resolve([...mockUserSpecificEvents].filter(event => event.userId === userId)
    .sort((a, b) => {
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateComparison !== 0) return dateComparison;
        return (a.startTime || "").localeCompare(b.startTime || "");
    }));
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
      category: "personal", 
      isUserSpecific: true,
    };

    mockUserSpecificEvents.push(newEvent);
    
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

// Admin action to add non-announcement community events (e.g., recurring board meetings)
// This is distinct from events created via the Announcement system.
export async function addCommunityEventByAdmin(
    adminUserId: string,
    values: Omit<CalendarEvent, 'id' | 'isUserSpecific' | 'userId'> 
): Promise<{ success: boolean; event?: CalendarEvent; message?: string }> {
    const admin = mockUsers.find(u => u.id === adminUserId && u.role === 'admin');
    if (!admin) {
        return { success: false, message: "Unauthorized." };
    }

    // Add validation schema here if this form is exposed to UI
    // For now, assuming data is well-formed from internal calls or trusted sources.

    const newCommunityEvent: CalendarEvent = {
        id: `manual-event-${Date.now()}`,
        title: values.title,
        date: values.date, 
        startTime: values.startTime,
        endTime: values.endTime,
        description: values.description,
        location: values.location,
        category: values.category, // Ensure this is one of the non-personal categories
        isUserSpecific: false,
    };
    mockCommunityEvents.push(newCommunityEvent);
    // Optionally notify all users about this new community event
    // const allUsers = mockUsers.filter(u => u.role === 'hoa'); // Example: Notify HOA members
    // for (const user of allUsers) {
    //   await createNotification({
    //     userId: user.id,
    //     title: `New Community Event: ${newCommunityEvent.title}`,
    //     message: newCommunityEvent.description?.substring(0,100) || "Check the calendar for details.",
    //     type: 'event',
    //     link: '/event-calendar'
    //   });
    // }
    return { success: true, event: newCommunityEvent, message: "Community event added." };
}
