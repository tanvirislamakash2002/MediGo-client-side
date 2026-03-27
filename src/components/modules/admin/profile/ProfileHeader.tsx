"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
    adminName: string;
}

export function ProfileHeader({ adminName }: ProfileHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>
        </div>
    );
}