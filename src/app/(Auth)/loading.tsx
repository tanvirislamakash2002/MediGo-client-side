// app/(Auth)/loading.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Pill } from "lucide-react";
import Link from "next/link";

export default function AuthLoading() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left Column - Brand Section Skeleton */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-primary/10 to-background relative overflow-hidden">
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo Skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                <Pill className="h-5 w-5 text-primary/50" />
                            </div>
                            <Skeleton className="h-7 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Skeleton className="h-9 w-16 rounded-md" />
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="space-y-8 my-auto">
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-64" />
                            <Skeleton className="h-6 w-full max-w-md" />
                            <Skeleton className="h-6 w-5/6 max-w-md" />
                        </div>

                        {/* Features Skeleton */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </div>

                        {/* Trust Badge Skeleton */}
                        <div className="pt-6">
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>

                    {/* Footer Skeleton */}
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>

            {/* Right Column - Form Section Skeleton */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Header Skeleton */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <Pill className="h-4 w-4 text-primary/50" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </div>
                        <div className="text-center">
                            <Skeleton className="h-7 w-40 mx-auto mb-2" />
                            <Skeleton className="h-4 w-48 mx-auto" />
                        </div>
                    </div>

                    {/* Form Card Skeleton */}
                    <Card className="border-0 shadow-none lg:shadow-lg bg-transparent lg:bg-background">
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-7 w-40 mx-auto lg:mx-0" />
                            <Skeleton className="h-4 w-56 mx-auto lg:mx-0" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Avatar Upload Skeleton (for register page) */}
                            <div className="flex justify-center">
                                <Skeleton className="h-24 w-24 rounded-full" />
                            </div>

                            {/* Name Field Skeleton */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>

                            {/* Email Field Skeleton */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>

                            {/* Role Selection Skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-14 w-full rounded-lg" />
                                    <Skeleton className="h-14 w-full rounded-lg" />
                                </div>
                            </div>

                            {/* Password Field Skeleton */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-3 w-full" />
                            </div>

                            {/* Confirm Password Field Skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>

                            {/* Remember Me & Forgot Password Skeleton */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-3">
                            <Skeleton className="h-10 w-full rounded-md" />
                            
                            {/* Divider Skeleton */}
                            <div className="relative w-full">
                                <Skeleton className="h-px w-full" />
                            </div>
                            
                            {/* Google Button Skeleton */}
                            <Skeleton className="h-10 w-full rounded-md" />
                            
                            {/* Sign In Link Skeleton */}
                            <Skeleton className="h-4 w-48 mx-auto" />
                            
                            {/* Demo Buttons Skeleton (only for login page) */}
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-full rounded-md" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-10 w-full rounded-md" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}