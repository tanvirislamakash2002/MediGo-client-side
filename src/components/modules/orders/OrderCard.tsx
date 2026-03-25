"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string | null;
        manufacturer: string;
        requiresPrescription: boolean;
    }[];
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
            return { variant: "default" as const, icon: Clock, label: "Order Placed", color: "bg-blue-500" };
        case "PROCESSING":
            return { variant: "secondary" as const, icon: Package, label: "Processing", color: "bg-yellow-500" };
        case "SHIPPED":
            return { variant: "secondary" as const, icon: Truck, label: "Shipped", color: "bg-purple-500" };
        case "DELIVERED":
            return { variant: "default" as const, icon: CheckCircle, label: "Delivered", color: "bg-green-500" };
        case "CANCELLED":
            return { variant: "destructive" as const, icon: XCircle, label: "Cancelled", color: "bg-red-500" };
        default:
            return { variant: "default" as const, icon: Clock, label: status, color: "bg-gray-500" };
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

export function OrderCard({ order, onViewDetails, onReorder, onCancel }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false);
    const status = getStatusBadge(order.status);
    const StatusIcon = status.icon;
    const canCancel = order.status === "PLACED" || order.status === "PROCESSING";
    const canReorder = order.status === "DELIVERED";

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                    <div className="flex items-center gap-3">
                        <Badge className={`${status.color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                        </Badge>
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
                                        <div className="flex items-center justify-center h-full text-lg">💊</div>
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
                    <div className="flex items-center gap-2">
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
                                    {order.status === "DELIVERED" 
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
                        
                        {/* Items List */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Items</p>
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                                        <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                            {isValidUrl(item.imageUrl) ? (
                                                <Image src={item.imageUrl!} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xl">💊</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                            {item.requiresPrescription && (
                                                <Badge variant="outline" className="mt-1 text-xs bg-red-50 text-red-700">
                                                    Rx Required
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm">${item.price.toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
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