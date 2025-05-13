import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/lib/types";
import { Megaphone, CalendarDays, UserCircle } from "lucide-react";
import Image from "next/image";

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Annual HOA Meeting Announced",
    content: "Join us for the annual HOA meeting on July 15th at 7 PM in the community hall. We will discuss the budget for the upcoming year and upcoming projects.",
    date: "2024-06-15",
    type: "announcement",
    author: "HOA Board",
  },
  {
    id: "2",
    title: "Summer Pool Party!",
    content: "Get ready for our annual summer pool party! Food, games, and fun for the whole family. July 20th, 12 PM - 4 PM.",
    date: "2024-06-10",
    type: "event",
    author: "Events Committee",
  },
  {
    id: "3",
    title: "Road Maintenance Schedule",
    content: "Please be advised that road resurfacing will take place on Oak Street and Pine Avenue from July 5th to July 7th. Expect minor delays.",
    date: "2024-06-05",
    type: "announcement",
    author: "Maintenance Team",
  },
];

export default function CommunityFeedPage() {
  return (
    <div className="space-y-6">
      {announcements.map((item) => (
        <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
            <Badge variant={item.type === "event" ? "default" : "secondary"} className="capitalize">
              {item.type === "event" ? <CalendarDays className="mr-1 h-4 w-4" /> : <Megaphone className="mr-1 h-4 w-4" />}
              {item.type}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{item.content}</p>
            {item.type === 'event' && (
                 <Image 
                    src="https://picsum.photos/600/200" // Placeholder image
                    alt={item.title} 
                    width={600} 
                    height={200} 
                    className="rounded-md object-cover aspect-[3/1]"
                    data-ai-hint="pool party" 
                />
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground flex justify-between">
            <span>Posted on: {new Date(item.date).toLocaleDateString()}</span>
            {item.author && (
              <div className="flex items-center">
                <UserCircle className="h-4 w-4 mr-1" />
                <span>{item.author}</span>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
