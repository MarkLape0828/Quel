
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "@/app/(auth)/login/components/login-form";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Welcome Back!</DialogTitle>
          <DialogDescription>
            Sign in to access your {APP_NAME} account.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 mb-4">
          <LoginForm />
        </div>
         <p className="mt-2 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors duration-150"
            onClick={onClose} // Close modal if navigating to register
          >
            Register here
          </Link>
        </p>
         <p className="mt-1 text-center text-xs text-muted-foreground">
          Admin?{" "}
          <Link 
            href="/admin/login" 
            className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors duration-150"
            onClick={onClose} // Close modal if navigating to admin login
          >
            Admin Sign In
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
