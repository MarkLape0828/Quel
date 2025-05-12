
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Log in to access your The Quel account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}