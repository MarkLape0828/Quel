
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Announcement } from "@/lib/types";
import { AnnouncementSchema, type AnnouncementFormValues } from "@/lib/schemas/announcement-schema";
import { addAnnouncement, updateAnnouncement } from "@/lib/announcement-actions"; // Server actions

interface AnnouncementFormProps {
  announcement?: Announcement; // For editing
  adminUserId: string;
  onSuccess: (announcement: Announcement) => void;
}

export function AnnouncementForm({ announcement, adminUserId, onSuccess }: AnnouncementFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!announcement;

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: announcement 
      ? {
          title: announcement.title || "",
          content: announcement.content || "",
          type: announcement.type || "announcement",
          author: announcement.author || "",
          imageUrl: announcement.imageUrl || "",
          aiHint: announcement.aiHint || "",
        }
      : {
          title: "",
          content: "",
          type: "announcement",
          author: "",
          imageUrl: "",
          aiHint: "",
        },
  });

  async function onSubmit(data: AnnouncementFormValues) {
    setIsSubmitting(true);
    let result;
    if (isEditing && announcement) {
      result = await updateAnnouncement(announcement.id, data, adminUserId);
    } else {
      result = await addAnnouncement(data, adminUserId);
    }
    setIsSubmitting(false);

    if (result.success && result.announcement) {
      toast({
        title: `Announcement ${isEditing ? 'Updated' : 'Added'}`,
        description: `"${result.announcement.title}" has been successfully ${isEditing ? 'updated' : 'added'}.`,
      });
      onSuccess(result.announcement);
    } else {
      toast({
        title: `Error ${isEditing ? 'Updating' : 'Adding'} Announcement`,
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof AnnouncementFormValues, { type: 'server', message: fieldErrors[0] as string });
          }
        });
      }
    }
  }
  
  const currentType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="e.g., Pool Maintenance Schedule" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl><Textarea placeholder="Detailed information about the announcement or event..." {...field} rows={5} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., HOA Board, Events Committee" {...field} /></FormControl>
              <FormDescription>If blank, admin's name will be used.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {currentType === 'event' && (
          <>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional for Events)</FormLabel>
                  <FormControl><Input placeholder="https://example.com/event-image.png" {...field} /></FormControl>
                  <FormDescription>Provide a URL for the event image. If blank, a placeholder will be used.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="aiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., community bbq, holiday party" {...field} /></FormControl>
                  <FormDescription>Keywords for placeholder image if URL is not provided (max 2 words).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Announcement")}
        </Button>
      </form>
    </Form>
  );
}
