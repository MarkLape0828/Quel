
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddPersonalEventSchema, type AddPersonalEventFormValues } from "@/lib/schemas/event-schema";
import { addUserSpecificEvent } from "@/lib/event-actions";
import type { CalendarEvent, User } from "@/lib/types";

interface AddEventFormProps {
  currentUser: User;
  onEventAdded: (newEvent: CalendarEvent) => void;
  closeDialog?: () => void; // Optional: to close a dialog after submission
}

export function AddEventForm({ currentUser, onEventAdded, closeDialog }: AddEventFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<AddPersonalEventFormValues>({
    resolver: zodResolver(AddPersonalEventSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      description: "",
      location: "",
    },
  });

  async function onSubmit(data: AddPersonalEventFormValues) {
    setIsSubmitting(true);
    const result = await addUserSpecificEvent(currentUser.id, data);
    setIsSubmitting(false);

    if (result.success && result.event) {
      toast({
        title: "Personal Event Added",
        description: `"${result.event.title}" has been added to your calendar.`,
      });
      form.reset();
      onEventAdded(result.event);
      if (closeDialog) closeDialog();
    } else {
      toast({
        title: "Error Adding Event",
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof AddPersonalEventFormValues, { type: 'server', message: fieldErrors[0] });
          }
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Doctor's Appointment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time (HH:MM)</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="e.g., 14:30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time (HH:MM, Optional)</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="e.g., 15:30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Conference Room B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes about the event..." {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {isSubmitting ? "Adding Event..." : "Add Personal Event"}
        </Button>
      </form>
    </Form>
  );
}
