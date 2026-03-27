"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, Shield, Clock } from "lucide-react";

interface ProfileHeaderProps {
    sellerName: string;
    isVerified?: boolean;
    isActive?: boolean;
    isPaused?: boolean;
}

export function ProfileHeader({ 
    sellerName, 
    isVerified = false, 
    isActive = true, 
    isPaused = false 
}: ProfileHeaderProps) {
    const router = useRouter();

    // Determine store status
    const getStoreStatus = () => {
        if (isPaused) {
            return {
                label: "Store Paused",
                className: "bg-yellow-100 text-yellow-700",
                icon: <Clock className="h-3 w-3 mr-1" />
            };
        }
        if (!isActive) {
            return {
                label: "Store Closed",
                className: "bg-red-100 text-red-700",
                icon: <Shield className="h-3 w-3 mr-1" />
            };
        }
        if (isVerified) {
            return {
                label: "Verified Seller",
                className: "bg-green-100 text-green-700",
                icon: <Shield className="h-3 w-3 mr-1" />
            };
        }
        return {
            label: "Pending Verification",
            className: "bg-orange-100 text-orange-700",
            icon: <Clock className="h-3 w-3 mr-1" />
        };
    };

    const status = getStoreStatus();

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
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold">{sellerName}</h1>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${status.className}`}>
                            {status.icon}
                            {status.label}
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Manage your store information and account settings
                    </p>
                </div>
            </div>
        </div>
    );
}