"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { updateOrderStatus } from "@/actions/order.action";
import { toast } from "sonner";

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
    }[];
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    shippingAddress: string;
    phone: string;
    deliveryInstructions?: string;
}

interface OrderCardProps {
    order: Order;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
    onViewDetails: () => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PLACED":
            return { variant: "default" as const, icon: Clock, label: "Pending", color: "bg-blue-500" };
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
        hour: "2-digit",
        minute: "2-digit",
    });
};

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

// Get next available status options based on current status
const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
        case "PLACED":
            return [
                { value: "PROCESSING", label: "Processing" }
            ];
        case "PROCESSING":
            return [
                { value: "SHIPPED", label: "Shipped" }
            ];
        case "SHIPPED":
            return [
                { value: "DELIVERED", label: "Delivered" }
            ];
        default:
            return [];
    }
};

export function OrderCard({ order, isSelected, onSelect, onViewDetails }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const status = getStatusBadge(order.status);
    const StatusIcon = status.icon;
    
    const canUpdateStatus = order.status !== "DELIVERED" && order.status !== "CANCELLED";
    const nextStatusOptions = getNextStatusOptions(order.status);

    const handleStatusUpdate = async () => {
        if (!selectedStatus) {
            toast.error("Please select a status to update");
            return;
        }
        setUpdating(true);
        const toastId = toast.loading(`Updating order #${order.id.slice(0, 8).toUpperCase()} to ${selectedStatus}...`);
        
        try {
            const result = await updateOrderStatus(order.id, selectedStatus);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success(`Order status updated to ${selectedStatus}`, { id: toastId });
                // Refresh the page to show updated status
                window.location.reload();
            }
        } catch (error) {
            toast.error("Failed to update order status", { id: toastId });
        } finally {
            setUpdating(false);
            setSelectedStatus("");
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onSelect}
                        className="mt-1"
                    />
                    
                    <div className="flex-1">
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
                        
                        {/* Customer Info */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="ml-2 font-medium">{order.customer.name}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Contact:</span>
                                <span className="ml-2">{order.customer.phone}</span>
                            </div>
                        </div>
                        
                        {/* Items Preview */}
                        <div className="mt-3">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={item.id} className="w-8 h-8 bg-muted rounded-full border-2 border-background overflow-hidden">
                                            {isValidUrl(item.imageUrl) ? (
                                                <Image src={item.imageUrl!} alt={item.name} width={32} height={32} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-sm">💊</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={onViewDetails}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                </Button>
                                
                                {canUpdateStatus && nextStatusOptions.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="px-3 py-1.5 text-sm border rounded-md bg-background"
                                            disabled={updating}
                                        >
                                            <option value="">Update Status</option>
                                            {nextStatusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    Mark as {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleStatusUpdate}
                                            disabled={!selectedStatus || updating}
                                            className="h-8"
                                        >
                                            {updating ? "Updating..." : "Apply"}
                                        </Button>
                                    </div>
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
                            <div className="mt-4 pt-4 border-t space-y-4">
                                {/* Items List */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Items</p>
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                                                <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                                    {isValidUrl(item.imageUrl) ? (
                                                        <Image src={item.imageUrl!} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-lg">💊</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm">${item.price.toFixed(2)}</p>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Shipping Address */}
                                <div>
                                    <p className="text-sm font-medium mb-1">Shipping Address</p>
                                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Phone: {order.phone}</p>
                                    {order.deliveryInstructions && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Instructions: {order.deliveryInstructions}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}