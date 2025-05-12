
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "./components/forgot-password-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forgot Your Password?</CardTitle>
        <CardDescription>
          No worries! Enter your email address below and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ForgotPasswordForm />
         <p className="mt-4 text-center text-sm">
          <Link href="/login" className="flex items-center justify-center font-medium text-primary hover:underline">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Log In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
