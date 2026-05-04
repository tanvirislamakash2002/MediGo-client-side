"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ReviewsHeader() {
    const router = useRouter();

    const handleRefresh = () => {
        router.refresh();
        toast.success("Reviews refreshed");
    };

    const handleExport = () => {
        toast.info("Export feature coming soon");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">Product Reviews</h1>
                <p className="text-muted-foreground mt-1">
                    See what customers are saying about your products
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}