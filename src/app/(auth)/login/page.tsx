
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./components/login-form";
import Link from "next/link";
import { LogIn } from "lucide-react"; // Corrected icon import

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden"> {/* Added rounded-xl and overflow-hidden */}
      <CardHeader className="text-center p-8 bg-card"> {/* Increased padding */}
        <div className="flex justify-center items-center mb-4">
          <LogIn className="h-10 w-10 text-primary" /> {/* Adjusted icon size */}
        </div>
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription className="pt-2 text-base text-muted-foreground"> {/* Adjusted size and color */}
          Log in to access your The Quel account.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-6 space-y-6 bg-card"> {/* Adjusted padding and spacing */}
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors duration-150"
          >
            Register here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
