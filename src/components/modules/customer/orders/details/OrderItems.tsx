"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Pill, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    manufacturer: string;
    requiresPrescription: boolean;
    status: string; // Add status field
}

interface Order {
    id: string;
    items?: OrderItem[];
}

interface OrderItemsProps {
    order: Order;
}

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

const getItemStatusBadge = (status: string) => {
    switch (status) {
        case "PLACED":
            return { icon: Clock, label: "Placed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
        case "PROCESSING":
            return { icon: Package, label: "Processing", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
        case "SHIPPED":
            return { icon: Truck, label: "Shipped", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" };
        case "DELIVERED":
            return { icon: CheckCircle, label: "Delivered", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
        case "CANCELLED":
            return { icon: XCircle, label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
        default:
            return { icon: Clock, label: status, color: "bg-gray-100 text-gray-800" };
    }
};

export function OrderItems({ order }: OrderItemsProps) {
    const items = order.items || [];
    const hasItems = items.length > 0;
    
    const subtotal = hasItems 
        ? items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
        : 0;

    if (!hasItems) {
        return (
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 border-b">
                    <h2 className="font-semibold">Items</h2>
                </div>
                <div className="p-8 text-center text-muted-foreground">
                    No items found for this order
                </div>
            </div>
        );
    }

    // Group items by status for summary
    const itemsByStatus = items.reduce((acc, item) => {
        const status = item.status || "PLACED";
        if (!acc[status]) acc[status] = [];
        acc[status].push(item);
        return acc;
    }, {} as Record<string, OrderItem[]>);

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
                <h2 className="font-semibold">Items ({items.length})</h2>
            </div>
            <div className="divide-y">
                {items.map((item) => {
                    const statusBadge = getItemStatusBadge(item.status);
                    const StatusIcon = statusBadge.icon;
                    
                    return (
                        <div key={item.id} className="p-4 flex gap-4">
                            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                {isValidUrl(item.imageUrl) ? (
                                    <Image
                                        src={item.imageUrl!}
                                        alt={item.name || "Medicine"}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-3xl"><Pill size={45}/></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap justify-between gap-2">
                                    <div className="flex-1">
                                        <Link
                                            href={`/shop/${item.id}`}
                                            className="font-medium hover:text-primary transition-colors"
                                        >
                                            {item.name || "Unknown Medicine"}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {item.manufacturer || "Unknown Manufacturer"}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {item.requiresPrescription && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                                >
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Prescription Required
                                                </Badge>
                                            )}
                                            <Badge className={`text-xs ${statusBadge.color}`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusBadge.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ${(item.price || 0).toFixed(2)} × {item.quantity || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="bg-muted/30 px-4 py-3 border-t flex justify-between">
                <span className="font-medium">Subtotal ({items.length} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
        </div>
    );
}