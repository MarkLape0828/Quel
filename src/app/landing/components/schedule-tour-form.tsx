
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScheduleTourSchema, type ScheduleTourFormValues } from "../schemas/schedule-tour-schema";
import { submitScheduleTourRequest } from "../actions/schedule-tour-action";

interface ScheduleTourFormProps {
  onFormSubmitSuccess?: () => void;
}

export function ScheduleTourForm({ onFormSubmitSuccess }: ScheduleTourFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ScheduleTourFormValues>({
    resolver: zodResolver(ScheduleTourSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: undefined,
      preferredTime: "",
      message: "",
    },
  });

  async function onSubmit(data: ScheduleTourFormValues) {
    setIsSubmitting(true);
    const result = await submitScheduleTourRequest(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Request Submitted!",
        description: result.message,
      });
      form.reset();
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } else {
      toast({
        title: "Submission Failed",
        description: result.message || "An error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof ScheduleTourFormValues, { type: 'server', message: fieldErrors[0] });
          }
        });
      }
    }
  }

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Preferred Date</FormLabel>
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
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0)) // Disable past dates
                        }
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
            name="preferredTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific requests or questions?"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Request Tour"}
        </Button>
      </form>
    </Form>
  );
}
