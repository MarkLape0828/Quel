
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { CalendarEvent, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, CalendarCheck2, Construction, PartyPopper, MapPin, ClockIcon, User as UserIcon, Trash2, PlusCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { getCommunityEvents, getUserSpecificEvents, deleteUserSpecificEvent } from "@/lib/event-actions";
import { mockUsers } from "@/lib/mock-data"; // For current user mock
import { AddEventForm } from "./components/add-event-form"; // New form component
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const getIconForCategory = (category: CalendarEvent['category']) => {
  switch (category) {
    case 'meeting': return <Briefcase className="mr-2 h-5 w-5" />;
    case 'community': return <PartyPopper className="mr-2 h-5 w-5" />;
    case 'maintenance': return <Construction className="mr-2 h-5 w-5" />;
    case 'personal': return <UserIcon className="mr-2 h-5 w-5 text-blue-500" />; // Example color for personal
    case 'event':
    default: return <CalendarCheck2 className="mr-2 h-5 w-5" />;
  }
};

export default function EventCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const { toast } = useToast();

  // MOCK USER - Replace with actual auth context in a real app
  const currentUserId = "user123"; // Alice Member
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0];

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const [communityEvents, userEvents] = await Promise.all([
        getCommunityEvents(),
        currentUser ? getUserSpecificEvents(currentUser.id) : Promise.resolve([]),
      ]);
      setAllEvents([...communityEvents, ...userEvents]);
    } catch (error) {
      console.error("Failed to load events:", error);
      toast({ title: "Error", description: "Could not load events.", variant: "destructive" });
    } finally {
      setIsLoadingEvents(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    setSelectedDate(new Date()); // Set initial date on client mount
    setIsClient(true);
    fetchEvents();
  }, [fetchEvents]);

  const handleEventAdded = (newEvent: CalendarEvent) => {
    setAllEvents(prevEvents => [...prevEvents, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || (a.startTime || "").localeCompare(b.startTime || "")));
    setIsAddEventModalOpen(false); // Close modal after adding
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to delete this personal event?")) return;

    const result = await deleteUserSpecificEvent(eventId, currentUser.id);
    if (result.success) {
      toast({ title: "Event Deleted", description: result.message });
      fetchEvents(); // Re-fetch events to update the list
    } else {
      toast({ title: "Error", description: result.message || "Could not delete event.", variant: "destructive" });
    }
  };

  const filteredEvents = allEvents
    .filter(event => selectedDate ? new Date(event.date + 'T00:00:00').toDateString() === selectedDate.toDateString() : true) // Ensure correct date comparison
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || (a.startTime || "").localeCompare(b.startTime || ""));

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isClient ? (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                initialFocus
              />
            ) : (
              <div className="rounded-md border p-3 h-[298px] w-[280px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Personal Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Personal Event</DialogTitle>
                  <DialogDescription>This event will only be visible to you.</DialogDescription>
                </DialogHeader>
                <div className="py-4 max-h-[70vh] overflow-y-auto pr-2">
                  {currentUser && <AddEventForm currentUser={currentUser} onEventAdded={handleEventAdded} closeDialog={() => setIsAddEventModalOpen(false)} />}
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Events Schedule</CardTitle>
            <CardDescription>
              {isClient && selectedDate 
                ? `Events for ${selectedDate.toLocaleDateString()}` 
                : "All community and personal events."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
               <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
               </div>
            ) : filteredEvents.length === 0 ? (
              <p className="text-muted-foreground">
                No events scheduled {selectedDate ? `for ${selectedDate.toLocaleDateString()}` : "for the selected criteria"}.
              </p>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className={`${event.isUserSpecific ? "bg-blue-500/10 border-blue-500/30" : "bg-secondary/50"}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          {getIconForCategory(event.category)}
                          {event.title}
                        </CardTitle>
                        <Badge 
                          variant={event.isUserSpecific ? "default" : "outline"} 
                          className={`capitalize ${event.isUserSpecific ? "bg-blue-500 text-white" : ""}`}
                        >
                           {event.isUserSpecific ? 'Personal' : event.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}
                      <div className="text-xs text-foreground space-y-1">
                        <div className="flex items-center">
                           <CalendarCheck2 className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
                           Date: {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {event.startTime && (
                          <div className="flex items-center">
                            <ClockIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                            Time: {event.startTime} {event.endTime ? ` - ${event.endTime}` : ''}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
                            Location: {event.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    {event.isUserSpecific && event.userId === currentUser?.id && (
                      <CardFooter className="pt-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
