
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ProfileSchema, type ProfileFormValues } from "../schema";
import { updateUserProfile } from "../actions";
import type { User } from "@/lib/types";

interface ProfileFormProps {
  user: User;
  onProfileUpdate: (updatedUser: User) => void;
}

export function ProfileForm({ user, onProfileUpdate }: ProfileFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      contactNumber: user.contactNumber || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    // In a real app, user.id would come from session or auth context
    const result = await updateUserProfile(user.id, data);
    setIsSubmitting(false);

    if (result.success && result.user) {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      onProfileUpdate(result.user); // Notify parent component of update
      form.reset(result.user as ProfileFormValues); // Reset form with new values
    } else {
      toast({
        title: "Update Failed",
        description: result.message || "An error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof ProfileFormValues, { type: 'server', message: fieldErrors[0] });
          }
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password change fields can be added here if desired */}
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
