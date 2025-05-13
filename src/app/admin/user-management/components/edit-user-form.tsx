
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EditUserSchema, type EditUserFormValues } from "../schemas";
import { updateUser } from "../actions";
import type { User, UserRole } from "@/lib/types";
import { USER_ROLES } from "@/lib/mock-data";

interface EditUserFormProps {
  user: User;
  onSuccess: (updatedUser: User) => void;
}

export function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || undefined,
      propertyId: user.propertyId || "",
      propertyAddress: user.propertyAddress || "",
    },
  });

  const currentRole = useWatch({
    control: form.control,
    name: "role",
  });

  async function onSubmit(data: EditUserFormValues) {
    setIsSubmitting(true);
    const result = await updateUser(user.id, data);
    setIsSubmitting(false);

    if (result.success && result.user) {
      toast({
        title: "User Updated",
        description: `${result.user.firstName} ${result.user.lastName}'s information has been updated.`,
      });
      onSuccess(result.user); // This will close the dialog via parent state
    } else {
      toast({
        title: "Error Updating User",
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof EditUserFormValues, { type: 'server', message: fieldErrors[0] });
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset property fields if role is not 'hoa'
                  if (value !== 'hoa') {
                    form.setValue('propertyId', '');
                    form.setValue('propertyAddress', '');
                  }
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {currentRole === 'hoa' && (
          <>
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., P101" {...field} />
                  </FormControl>
                  <FormDescription>Assign a unique ID to this user's property.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123 Main St, The Quel" {...field} />
                  </FormControl>
                  <FormDescription>The address of the user's property.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
