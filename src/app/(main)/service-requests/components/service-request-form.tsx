"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ServiceRequestSchema, type ServiceRequestFormValues } from "../schema";
import { submitServiceRequest } from "../actions";
import type { ServiceRequest } from "@/lib/types";
import React from "react";

interface ServiceRequestFormProps {
  onFormSubmit: (newRequest: ServiceRequest) => void;
}

export function ServiceRequestForm({ onFormSubmit }: ServiceRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(ServiceRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined, // Or a default like "maintenance"
      location: "",
    },
  });

  async function onSubmit(data: ServiceRequestFormValues) {
    setIsSubmitting(true);
    const result = await submitServiceRequest(data);
    setIsSubmitting(false);

    if (result.success && result.request) {
      toast({
        title: "Success!",
        description: result.message,
      });
      form.reset();
      onFormSubmit(result.request);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to submit request.",
        variant: "destructive",
      });
      // Handle field errors if any (result.errors)
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                 form.setError(fieldName as keyof ServiceRequestFormValues, { type: 'server', message: fieldErrors[0] });
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Broken streetlight on Main St" {...field} />
              </FormControl>
              <FormDescription>A brief title for your request.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the most relevant category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the issue."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include as much detail as possible to help us address the issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Near the playground" {...field} />
              </FormControl>
              <FormDescription>Specify the location if applicable.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Form>
  );
}
