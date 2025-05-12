
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
import { LoginSchema, type LoginFormValues } from "../schema";
import { loginUser } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For programmatic navigation

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    const result = await loginUser(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Login Successful!",
        description: result.message,
      });
      // Mock redirect based on role
      if (result.role === "admin") {
        router.push("/admin/billing"); // Or admin dashboard
      } else {
        router.push("/community-feed");
      }
      form.reset();
    } else {
      toast({
        title: "Login Failed",
        description: result.message || "An error occurred.",
        variant: "destructive",
      });
       if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                 form.setError(fieldName as keyof LoginFormValues, { type: 'server', message: fieldErrors[0] });
            }
        });
      } else if (!result.errors && result.message) {
        // General error not tied to a field
        form.setError("root.serverError", { type: "server", message: result.message });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root?.serverError && (
            <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.serverError.message}
            </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
        <div className="text-sm text-center">
          <Link href="/forgot-password" passHref className="font-medium text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </form>
    </Form>
  );
}
