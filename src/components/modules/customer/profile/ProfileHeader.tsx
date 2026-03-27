"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
    customerName: string;
}

export function ProfileHeader({ customerName }: ProfileHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-9 w-9 shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">My Account</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your personal information, orders, and preferences
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Welcome back, {customerName.split(" ")[0]}
                </div>
            </div>
        </div>
    );
}