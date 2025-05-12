"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // For date picking context
import type { CalendarEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarCheck2, Construction, PartyPopper, MapPin, ClockIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Board Meeting",
    date: "2024-07-10",
    startTime: "19:00",
    endTime: "21:00",
    description: "Monthly HOA board meeting. Open to all residents.",
    category: "meeting",
    location: "Community Hall - Room A",
  },
  {
    id: "2",
    title: "Community BBQ",
    date: "2024-07-20",
    startTime: "12:00",
    endTime: "16:00",
    description: "Join us for a fun community BBQ! Food, games, and music.",
    category: "community",
    location: "Park Pavilion",
  },
  {
    id: "3",
    title: "Pool Maintenance",
    date: "2024-07-25",
    startTime: "08:00",
    endTime: "17:00",
    description: "The community pool will be closed for scheduled maintenance.",
    category: "maintenance",
    location: "Community Pool",
  },
  {
    id: "4",
    title: "Movie Night Under the Stars",
    date: "2024-08-05",
    startTime: "20:30",
    description: "Family-friendly movie night at the community green. Bring your blankets!",
    category: "event",
    location: "Community Green",
  },
];

const getIconForCategory = (category: CalendarEvent['category']) => {
  switch (category) {
    case 'meeting':
      return <Briefcase className="mr-2 h-5 w-5" />;
    case 'community':
      return <PartyPopper className="mr-2 h-5 w-5" />;
    case 'maintenance':
      return <Construction className="mr-2 h-5 w-5" />;
    case 'event':
      return <CalendarCheck2 className="mr-2 h-5 w-5" />;
    default:
      return <CalendarCheck2 className="mr-2 h-5 w-5" />;
  }
};

export default function EventCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setSelectedDate(new Date());
    setIsClient(true);
  }, []);

  const filteredEvents = events
    .filter(event => selectedDate ? new Date(event.date).toDateString() === selectedDate.toDateString() : true)
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
                <p>Loading Calendar...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              {isClient && selectedDate 
                ? `Events for ${selectedDate.toLocaleDateString()}` 
                : "All upcoming community events, meetings, and maintenance schedules."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isClient ? (
              <p className="text-muted-foreground">Loading events...</p>
            ) : filteredEvents.length === 0 ? (
              <p className="text-muted-foreground">
                No events scheduled {selectedDate ? `for ${selectedDate.toLocaleDateString()}` : "for the selected criteria"}.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="bg-secondary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          {getIconForCategory(event.category)}
                          {event.title}
                        </CardTitle>
                        <Badge variant="outline" className="capitalize">{event.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="text-xs text-foreground space-y-1">
                        <div className="flex items-center">
                           <CalendarCheck2 className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
                           Date: {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
