"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
    id: string;
    status: string;
}

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    customerId: string;
    items: OrderItem[];
}

interface OrderHeaderProps {
    order: Order;
}

// Calculate accurate status from items
const getAccurateStatus = (items: OrderItem[]): { label: string; color: string; variant: string } => {
    if (!items.length) return { label: "Order Placed", color: "bg-blue-500", variant: "default" };
    
    const statuses = items.map(i => i.status);
    
    if (statuses.every(s => s === "DELIVERED")) {
        return { label: "Delivered", color: "bg-green-500", variant: "success" };
    }
    if (statuses.every(s => s === "CANCELLED")) {
        return { label: "Cancelled", color: "bg-red-500", variant: "destructive" };
    }
    if (statuses.some(s => s === "DELIVERED")) {
        const delivered = statuses.filter(s => s === "DELIVERED").length;
        return { label: `${delivered}/${items.length} Delivered`, color: "bg-green-500", variant: "partial" };
    }
    if (statuses.some(s => s === "SHIPPED")) {
        return { label: "Partially Shipped", color: "bg-purple-500", variant: "warning" };
    }
    if (statuses.some(s => s === "PROCESSING")) {
        return { label: "Processing", color: "bg-yellow-500", variant: "warning" };
    }
    
    return { label: "Order Placed", color: "bg-blue-500", variant: "default" };
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function OrderHeader({ order }: OrderHeaderProps) {
    const status = getAccurateStatus(order.items || []);
    const orderIdShort = order.id.slice(0, 8).toUpperCase();

    const handleCopyId = () => {
        navigator.clipboard.writeText(order.id);
        toast.success("Order ID copied to clipboard");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    Order #{orderIdShort}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyId}
                        className="h-8 w-8"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </h1>
                <p className="text-muted-foreground mt-1">
                    Placed on {formatDate(order.createdAt)}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Badge className={`${status.color} text-white px-3 py-1`}>
                    {status.label}
                </Badge>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                </Button>
            </div>
        </div>
    );
}