
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VisitorPassRequestSchema, type VisitorPassFormValues } from "@/lib/schemas/visitor-pass-schema";
import { requestVisitorPass } from "@/lib/visitor-pass-actions";
import type { VisitorPassRequest, User } from "@/lib/types";

interface RequestPassFormProps {
  currentUser: User;
  onPassRequested: (newPass: VisitorPassRequest) => void;
}

const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];
const durationOptions = [1, 2, 3, 4, 6, 8, 12, 24].map(h => ({ label: `${h} hour${h > 1 ? 's' : ''}`, value: h.toString() }));


export function RequestPassForm({ currentUser, onPassRequested }: RequestPassFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VisitorPassFormValues>({
    resolver: zodResolver(VisitorPassRequestSchema),
    defaultValues: {
      visitorName: "",
      visitDate: undefined,
      visitStartTime: "",
      durationHours: undefined,
      vehiclePlate: "",
    },
  });

  async function onSubmit(data: VisitorPassFormValues) {
    setIsSubmitting(true);
    const result = await requestVisitorPass(data, currentUser);
    setIsSubmitting(false);

    if (result.success && result.pass) {
      toast({
        title: "Pass Requested",
        description: "Your visitor pass request has been submitted.",
      });
      form.reset();
      onPassRequested(result.pass);
    } else {
      toast({
        title: "Request Failed",
        description: result.message || "An error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof VisitorPassFormValues, { type: 'server', message: fieldErrors[0] });
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
          name="visitorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visitor's Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="visitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Visit</FormLabel>
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
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visitStartTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approx. Arrival Time (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select arrival time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="durationHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Duration (Optional)</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {durationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehiclePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visitor's Vehicle Plate (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ABC 123" {...field} />
              </FormControl>
              <FormDescription>Required if visitor is bringing a vehicle.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Request Pass"}
        </Button>
      </form>
    </Form>
  );
}
