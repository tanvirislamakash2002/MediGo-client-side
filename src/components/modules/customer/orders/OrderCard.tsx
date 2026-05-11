"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Pill, AlertCircle } from "lucide-react";
import Image from "next/image";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    manufacturer: string;
    requiresPrescription: boolean;
    status: string; // Add status for each item
}

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: string;
    phone: string;
    deliveryInstructions?: string; 
    estimatedDeliveryDate?: string;
}

interface OrderCardProps {
    order: Order;
    onViewDetails: () => void;
    onReorder: () => void;
    onCancel: () => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PLACED":
            return { icon: Clock, label: "Placed", color: "bg-blue-500" };
        case "PROCESSING":
            return { icon: Package, label: "Processing", color: "bg-yellow-500" };
        case "SHIPPED":
            return { icon: Truck, label: "Shipped", color: "bg-purple-500" };
        case "DELIVERED":
            return { icon: CheckCircle, label: "Delivered", color: "bg-green-500" };
        case "CANCELLED":
            return { icon: XCircle, label: "Cancelled", color: "bg-red-500" };
        default:
            return { icon: Clock, label: status, color: "bg-gray-500" };
    }
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

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

// Calculate order-level status from items for display
const getOrderLevelStatus = (items: OrderItem[]): string => {
    if (!items.length) return "PLACED";
    
    const statuses = items.map(i => i.status);
    
    if (statuses.every(s => s === "DELIVERED")) return "DELIVERED";
    if (statuses.every(s => s === "CANCELLED")) return "CANCELLED";
    if (statuses.some(s => s === "DELIVERED")) return "PARTIALLY_DELIVERED";
    if (statuses.some(s => s === "SHIPPED")) return "PARTIALLY_SHIPPED";
    if (statuses.some(s => s === "PROCESSING")) return "PROCESSING";
    
    return "PLACED";
};

export function OrderCard({ order, onViewDetails, onReorder, onCancel }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false);
    const orderLevelStatus = getOrderLevelStatus(order.items);
    const status = getStatusBadge(orderLevelStatus);
    const StatusIcon = status.icon;
    const canCancel = orderLevelStatus === "PLACED" || orderLevelStatus === "PROCESSING";
    const canReorder = orderLevelStatus === "DELIVERED";

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${status.color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                        </Badge>
                        {/* Show mixed status indicator */}
                        {orderLevelStatus.startsWith("PARTIALLY_") && (
                            <Badge variant="outline" className="text-xs gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Mixed Status
                            </Badge>
                        )}
                        <span className="text-sm font-mono text-muted-foreground">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                            {formatDate(order.createdAt)}
                        </span>
                        <span className="font-bold text-primary">
                            ${order.totalAmount.toFixed(2)}
                        </span>
                    </div>
                </div>
                
                {/* Items Preview */}
                <div className="mt-4">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                                <div key={item.id} className="w-10 h-10 bg-muted rounded-full border-2 border-background overflow-hidden">
                                    {isValidUrl(item.imageUrl) ? (
                                        <Image src={item.imageUrl!} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-lg"><Pill size={45}/></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · 
                            <span className="text-muted-foreground ml-1">
                                {order.items.map(i => i.name).join(", ").slice(0, 40)}
                                {order.items.map(i => i.name).join(", ").length > 40 ? "..." : ""}
                            </span>
                        </p>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="ghost" size="sm" onClick={onViewDetails}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                        </Button>
                        {canReorder && (
                            <Button variant="outline" size="sm" onClick={onReorder}>
                                Reorder
                            </Button>
                        )}
                        {canCancel && (
                            <Button variant="destructive" size="sm" onClick={onCancel}>
                                Cancel Order
                            </Button>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="text-muted-foreground"
                    >
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {expanded ? "Show Less" : "Show More"}
                    </Button>
                </div>
                
                {/* Expanded Details */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                                <p className="text-sm">{order.shippingAddress}</p>
                                <p className="text-sm text-muted-foreground mt-1">Phone: {order.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Delivery Information</p>
                                <p className="text-sm">
                                    {orderLevelStatus === "DELIVERED" 
                                        ? "Delivered on " + formatDate(order.createdAt)
                                        : order.estimatedDeliveryDate 
                                            ? `Estimated delivery: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}`
                                            : "Processing your order"}
                                </p>
                                {order.deliveryInstructions && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Notes: {order.deliveryInstructions}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Items List with Status */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Items</p>
                            <div className="space-y-2">
                                {order.items.map((item) => {
                                    const itemStatus = getItemStatusBadge(item.status);
                                    const ItemIcon = itemStatus.icon;
                                    
                                    return (
                                        <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                                            <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                                {isValidUrl(item.imageUrl) ? (
                                                    <Image src={item.imageUrl!} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xl"><Pill size={45}/></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {item.requiresPrescription && (
                                                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                                            Rx Required
                                                        </Badge>
                                                    )}
                                                    <Badge className={`text-xs ${itemStatus.color}`}>
                                                        <ItemIcon className="h-2 w-2 mr-1" />
                                                        {itemStatus.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">${item.price.toFixed(2)}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Order Summary */}
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}