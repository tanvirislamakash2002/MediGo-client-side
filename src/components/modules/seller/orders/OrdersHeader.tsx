"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrdersHeaderProps {
    orderCount: number;
}

export function OrdersHeader({ orderCount }: OrdersHeaderProps) {
    const router = useRouter();

    const handleExport = async () => {
        toast.success("Export started...");
        // Export logic here
    };

    const handleRefresh = () => {
        router.refresh();
        toast.success("Orders refreshed");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground mt-1">
                    View and manage customer orders for your medicines
                </p>
                {orderCount > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Total orders: {orderCount}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}