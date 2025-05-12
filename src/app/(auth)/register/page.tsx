
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "./components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Join The Quel to manage your community services and stay connected.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}