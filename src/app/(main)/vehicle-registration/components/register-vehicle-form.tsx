
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
import { useToast } from "@/hooks/use-toast";
import { VehicleRegistrationSchema, type VehicleRegistrationFormValues } from "@/lib/schemas/vehicle-schema";
import { registerVehicle } from "@/lib/vehicle-actions";
import type { VehicleRegistration, User } from "@/lib/types";
import { CarFront } from "lucide-react";

interface RegisterVehicleFormProps {
  currentUser: User;
  onVehicleRegistered: (newVehicle: VehicleRegistration) => void;
}

export function RegisterVehicleForm({ currentUser, onVehicleRegistered }: RegisterVehicleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VehicleRegistrationFormValues>({
    resolver: zodResolver(VehicleRegistrationSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: "",
    },
  });

  async function onSubmit(data: VehicleRegistrationFormValues) {
    setIsSubmitting(true);
    const result = await registerVehicle(data, currentUser);
    setIsSubmitting(false);

    if (result.success && result.vehicle) {
      toast({
        title: "Vehicle Registered",
        description: "Your vehicle has been successfully registered.",
      });
      form.reset();
      onVehicleRegistered(result.vehicle);
    } else {
      toast({
        title: "Registration Failed",
        description: result.message || "An error occurred.",
        variant: "destructive",
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            form.setError(fieldName as keyof VehicleRegistrationFormValues, { type: 'server', message: fieldErrors[0] });
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
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Make</FormLabel>
                <FormControl><Input placeholder="e.g., Toyota" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Model</FormLabel>
                <FormControl><Input placeholder="e.g., Camry" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 2022" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl><Input placeholder="e.g., Blue" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate Number</FormLabel>
              <FormControl><Input placeholder="e.g., ABC 123" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          <CarFront className="mr-2 h-4 w-4" />
          {isSubmitting ? "Registering..." : "Register Vehicle"}
        </Button>
      </form>
    </Form>
  );
}
