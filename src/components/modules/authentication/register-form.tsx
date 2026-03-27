"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Store, ShoppingBag } from "lucide-react";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "SELLER"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Remove <FormValues> - let TypeScript infer
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER" as "CUSTOMER" | "SELLER", // Explicit union type
    },
    onSubmit: async ({ value }) => {
      // Validate manually using Zod
      const result = formSchema.safeParse(value);

      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || "Validation failed";
        toast.error(errorMessage);
        return;
      }

      setIsLoading(true);
      setError(null);
      const toastId = toast.loading("Creating your account...");

      try {
        const response = await authClient.signUp.email({
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
          role: result.data.role,
        } as any);

        if (response.error) {
          toast.error(response.error.message || "Failed to create account", { id: toastId });
          setError(response.error.message || "Registration failed");
          return;
        }

        toast.success("Account created successfully!", { id: toastId });

        // Redirect based on role
        if (result.data.role === "SELLER") {
          toast.info("Please complete your seller verification", { duration: 5000 });
          router.push("/");
        } else {
          router.push("/");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.", { id: toastId });
        setError("Failed to create account. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      });
    } catch (error) {
      toast.error("Failed to login with Google");
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { text: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (score <= 4) return { text: "Good", color: "bg-yellow-500", width: "w-2/3" };
    return { text: "Strong", color: "bg-green-500", width: "w-full" };
  };

  return (
    <Card className="border-0 shadow-none lg:shadow-lg w-full max-w-md mx-auto" {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center lg:text-left">
          Create an account
        </CardTitle>
        <CardDescription className="text-center lg:text-left">
          Join MediGo and start shopping for authentic medicines
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Full Name */}
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="Enter your name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isLoading}
                    className={isInvalid ? "border-red-500" : ""}
                  />
                  {isInvalid && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="name@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isLoading}
                    className={isInvalid ? "border-red-500" : ""}
                  />
                  {isInvalid && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Role Selection */}
          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <Label>I want to</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${field.state.value === "CUSTOMER"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => field.handleChange("CUSTOMER")}
                  >
                    <ShoppingBag className={`h-5 w-5 ${field.state.value === "CUSTOMER" ? "text-primary" : "text-muted-foreground"}`} />
                    <Label className="cursor-pointer font-medium">Customer</Label>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${field.state.value === "SELLER"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => field.handleChange("SELLER")}
                  >
                    <Store className={`h-5 w-5 ${field.state.value === "SELLER" ? "text-primary" : "text-muted-foreground"}`} />
                    <Label className="cursor-pointer font-medium">Seller</Label>
                  </div>
                </div>
              </div>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              const strength = passwordStrength(field.state.value);
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isLoading}
                      className={isInvalid ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {field.state.value && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
                        </div>
                        <span className="text-xs text-muted-foreground">{strength.text}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must contain at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>
                  )}
                  {isInvalid && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Confirm Password */}
          <form.Field name="confirmPassword">
            {(field) => {
              const password = form.getFieldValue("password");
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isLoading}
                      className={isInvalid ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {isInvalid && (
                    <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                  )}
                  {field.state.value && password && field.state.value !== password && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Seller Info Note */}
          <form.Field name="role">
            {(field) => (
              field.state.value === "SELLER" && (
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
                    As a seller, you'll need to complete verification after registration.
                    You'll be able to add medicines and manage your store once verified.
                  </AlertDescription>
                </Alert>
              )
            )}
          </form.Field>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button
          form="register-form"
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          type="button"
          className="w-full gap-2"
          disabled={isLoading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}