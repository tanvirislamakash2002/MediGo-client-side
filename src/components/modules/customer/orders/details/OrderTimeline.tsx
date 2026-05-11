"use client";

import { useState } from "react";
import { CheckCircle, Package, Truck, Clock, XCircle, ChevronDown, ChevronUp, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
    id: string;
    name: string;
    status: string;
    sellerId: string;
    sellerName?: string;
}

interface Order {
    status: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    sellerGroups?: Array<{
        sellerId: string;
        sellerName: string;
        status: string;
        items: OrderItem[];
    }>;
}

interface OrderTimelineProps {
    order: Order;
}

const timelineSteps = [
    { key: "PLACED", label: "Order Placed", icon: Clock, description: "Order confirmed" },
    { key: "PROCESSING", label: "Processing", icon: Package, description: "Preparing your items" },
    { key: "SHIPPED", label: "Shipped", icon: Truck, description: "On the way" },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle, description: "Delivered" },
];

const getStepIndex = (status: string) => {
    return timelineSteps.findIndex(step => step.key === status);
};

const getStatusColor = (status: string, isCompleted: boolean) => {
    if (isCompleted) return "bg-green-500 text-white";
    switch (status) {
        case "PLACED": return "bg-blue-500 text-white";
        case "PROCESSING": return "bg-yellow-500 text-white";
        case "SHIPPED": return "bg-purple-500 text-white";
        case "DELIVERED": return "bg-green-500 text-white";
        case "CANCELLED": return "bg-red-500 text-white";
        default: return "bg-muted text-muted-foreground";
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Single Seller Timeline Component
function SellerTimeline({ seller, orderCreatedAt }: { seller: { sellerId: string; sellerName: string; status: string; items: OrderItem[] }; orderCreatedAt: string }) {
    const [expanded, setExpanded] = useState(false);
    const currentStepIndex = getStepIndex(seller.status);
    
    // Calculate stats for this seller
    const totalItems = seller.items.length;
    const deliveredItems = seller.items.filter(i => i.status === "DELIVERED").length;
    const progressPercentage = (deliveredItems / totalItems) * 100;
    const hasMultipleItems = totalItems > 1;
    
    if (seller.status === "CANCELLED") {
        return (
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-red-50 dark:bg-red-950/30 p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <Store className="h-5 w-5 text-red-500" />
                            <div>
                                <h3 className="font-semibold">{seller.sellerName}</h3>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    Cancelled
                                </p>
                            </div>
                        </div>
                        {hasMultipleItems && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                            >
                                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                {expanded ? "Hide Items" : `View ${totalItems} Item${totalItems > 1 ? 's' : ''}`}
                            </button>
                        )}
                    </div>
                    
                    {expanded && (
                        <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                            <div className="space-y-2">
                                {seller.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.name}</span>
                                        <Badge variant="outline" className="text-red-600">Cancelled</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Seller Header */}
            <div className="bg-muted/30 px-4 py-3 border-b">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <h3 className="font-semibold">{seller.sellerName}</h3>
                        {hasMultipleItems && (
                            <Badge variant="outline" className="text-xs">
                                {totalItems} items
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {hasMultipleItems && deliveredItems > 0 && deliveredItems < totalItems && (
                            <span className="text-xs text-muted-foreground">
                                {deliveredItems}/{totalItems} delivered
                            </span>
                        )}
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            {expanded ? "Hide Details" : "Show Details"}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Progress Bar for multi-item orders */}
            {hasMultipleItems && deliveredItems > 0 && deliveredItems < totalItems && (
                <div className="px-4 pt-4">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}
            
            {/* Timeline */}
            <div className="p-4">
                <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted-foreground/20" />
                    <div className="relative flex justify-between">
                        {timelineSteps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon = step.icon;
                            
                            return (
                                <div key={step.key} className="flex flex-col items-center text-center flex-1">
                                    <div
                                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            isCompleted || isCurrent
                                                ? getStatusColor(seller.status, isCompleted)
                                                : "bg-muted text-muted-foreground"
                                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs font-medium mt-2 hidden sm:block">{step.label}</p>
                                    {isCurrent && (
                                        <p className="text-xs text-primary mt-1 font-medium">Current</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Expanded Items List */}
            {expanded && (
                <div className="px-4 pb-4 pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Items in this order:</p>
                    <div className="space-y-2">
                        {seller.items.map((item) => {
                            const itemStepIndex = getStepIndex(item.status);
                            const itemStep = timelineSteps[itemStepIndex];
                            const ItemIcon = itemStep?.icon || Clock;
                            
                            return (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ItemIcon className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs capitalize">{item.status.toLowerCase()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export function OrderTimeline({ order }: OrderTimelineProps) {
    // Group items by seller if not already grouped
    let sellerGroups = order.sellerGroups;
    
    if (!sellerGroups && order.items) {
        const groups = new Map<string, { sellerId: string; sellerName: string; items: OrderItem[] }>();
        
        order.items.forEach(item => {
            const sellerId = item.sellerId;
            if (!groups.has(sellerId)) {
                groups.set(sellerId, {
                    sellerId,
                    sellerName: item.sellerName || `Seller ${sellerId.slice(0, 8)}`,
                    items: []
                });
            }
            groups.get(sellerId)!.items.push(item);
        });
        
        sellerGroups = Array.from(groups.values()).map(group => ({
            ...group,
            status: getOverallStatus(group.items)
        }));
    }
    
    // If only one seller, show single timeline without expansion
    const isSingleSeller = sellerGroups?.length === 1;
    
    if (isSingleSeller && sellerGroups) {
        const seller = sellerGroups[0];
        return <SellerTimeline seller={seller} orderCreatedAt={order.createdAt} />;
    }
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Order Progress by Seller</h2>
                <Badge variant="outline" className="text-xs">
                    {sellerGroups?.length || 0} Sellers
                </Badge>
            </div>
            
            {sellerGroups?.map((seller) => (
                <SellerTimeline 
                    key={seller.sellerId} 
                    seller={seller} 
                    orderCreatedAt={order.createdAt} 
                />
            ))}
        </div>
    );
}

// Helper function to get overall status for a seller
function getOverallStatus(items: OrderItem[]): string {
    if (!items.length) return "PLACED";
    
    const statuses = items.map(i => i.status);
    
    if (statuses.every(s => s === "DELIVERED")) return "DELIVERED";
    if (statuses.every(s => s === "CANCELLED")) return "CANCELLED";
    if (statuses.some(s => s === "DELIVERED")) return "DELIVERED";
    if (statuses.some(s => s === "SHIPPED")) return "SHIPPED";
    if (statuses.some(s => s === "PROCESSING")) return "PROCESSING";
    
    return "PLACED";
}