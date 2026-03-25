"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    customerId: string;
}

interface OrderHeaderProps {
    order: Order;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PLACED":
            return { label: "Order Placed", color: "bg-blue-500" };
        case "PROCESSING":
            return { label: "Processing", color: "bg-yellow-500" };
        case "SHIPPED":
            return { label: "Shipped", color: "bg-purple-500" };
        case "DELIVERED":
            return { label: "Delivered", color: "bg-green-500" };
        case "CANCELLED":
            return { label: "Cancelled", color: "bg-red-500" };
        default:
            return { label: status, color: "bg-gray-500" };
    }
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
    const status = getStatusBadge(order.status);
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