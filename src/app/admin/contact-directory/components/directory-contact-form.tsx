
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import type { DirectoryContact } from "@/lib/types";
import { DirectoryContactSchema, type DirectoryContactFormValues } from "../schemas";
import { addDirectoryContact, updateDirectoryContact } from "@/lib/contact-directory-actions";
import { PlusCircle, Trash2 } from "lucide-react";

interface DirectoryContactFormProps {
  contact?: DirectoryContact; // For editing
  onSuccess: (contact: DirectoryContact) => void;
}

const socialPlatformOptions = ["website", "facebook", "twitter", "instagram", "linkedin", "other"];

export function DirectoryContactForm({ contact, onSuccess }: DirectoryContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!contact;

  const form = useForm<DirectoryContactFormValues>({
    resolver: zodResolver(DirectoryContactSchema),
    defaultValues: contact 
      ? {
          name: contact.name || "",
          department: contact.department || "",
          phoneNumber: contact.phoneNumber || "",
          email: contact.email || "",
          socialMediaLinks: contact.socialMediaLinks || [],
          notes: contact.notes || "",
        }
      : {
          name: "",
          department: "",
          phoneNumber: "",
          email: "",
          socialMediaLinks: [],
          notes: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMediaLinks",
  });

  async function onSubmit(data: DirectoryContactFormValues) {
    setIsSubmitting(true);
    let result;
    if (isEditing && contact) {
      result = await updateDirectoryContact(contact.id, data);
    } else {
      result = await addDirectoryContact(data);
    }
    setIsSubmitting(false);

    if (result.success && result.contact) {
      toast({
        title: `Contact ${isEditing ? 'Updated' : 'Added'}`,
        description: `${result.contact.name} has been successfully ${isEditing ? 'updated' : 'added'}.`,
      });
      onSuccess(result.contact);
    } else {
      toast({
        title: `Error ${isEditing ? 'Updating' : 'Adding'} Contact`,
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
             const name = fieldName as keyof DirectoryContactFormValues;
             if (name === "socialMediaLinks" && typeof fieldErrors === 'object' && fieldErrors !== null) {
                // Handle array errors if necessary, e.g. for specific items
             } else {
                form.setError(name, { type: 'server', message: fieldErrors[0] as string });
             }
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name / Title</FormLabel>
              <FormControl><Input placeholder="e.g., HOA Main Office, Security Desk" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department / Category</FormLabel>
              <FormControl><Input placeholder="e.g., Administration, Security, Maintenance" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address (Optional)</FormLabel>
              <FormControl><Input type="email" placeholder="contact@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Social Media Links (Optional)</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end gap-2 mt-2 p-3 border rounded-md">
              <FormField
                control={form.control}
                name={`socialMediaLinks.${index}.platform`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Platform" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {socialPlatformOptions.map(opt => <SelectItem key={opt} value={opt} className="capitalize">{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socialMediaLinks.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">URL</FormLabel>
                    <FormControl><Input placeholder="https://example.com/profile" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name={`socialMediaLinks.${index}.displayText`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Display Text (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g. Follow Us!" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} aria-label="Remove social media link">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ platform: '', url: '', displayText: '' })}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
          </Button>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl><Textarea placeholder="e.g., Office Hours: Mon-Fri 9 AM - 5 PM" {...field} rows={3} /></FormControl>
              <FormDescription>Any additional information or context.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Contact")}
        </Button>
      </form>
    </Form>
  );
}
