"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Eye, Package, Truck, CheckCircle, XCircle, Clock, 
    ChevronDown, ChevronUp, AlertCircle 
} from "lucide-react";
import Image from "next/image";
import { updateOrderItemStatus } from "@/actions/order.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "./ConfirmModal";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    manufacturer: string;
    status: string;
}

interface Order {
    id: string;
    createdAt: string;
    totalAmount: number;
    items: OrderItem[];
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
    onViewDetails: () => void;
    onStatusUpdate?: () => void;
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

const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
        case "PLACED":
            return [{ value: "PROCESSING", label: "Processing" }];
        case "PROCESSING":
            return [{ value: "SHIPPED", label: "Shipped" }];
        case "SHIPPED":
            return [{ value: "DELIVERED", label: "Delivered" }];
        default:
            return [];
    }
};

const areAllItemsSameStatus = (items: OrderItem[]): boolean => {
    if (items.length === 0) return true;
    const firstStatus = items[0].status;
    return items.every(item => item.status === firstStatus);
};

const getUniqueStatuses = (items: OrderItem[]): string[] => {
    return [...new Set(items.map(item => item.status))];
};

export function OrderCard({ order, onViewDetails, onStatusUpdate }: OrderCardProps) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [localItems, setLocalItems] = useState<OrderItem[]>(order.items);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    const allSameStatus = areAllItemsSameStatus(localItems);
    const uniqueStatuses = getUniqueStatuses(localItems);
    
    let displayStatus = localItems[0]?.status || "PLACED";
    let isMixedStatus = false;
    
    if (!allSameStatus) {
        isMixedStatus = true;
        const statusPriority = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
        const highestPriority = statusPriority.find(status => uniqueStatuses.includes(status));
        if (highestPriority) displayStatus = highestPriority;
        else if (uniqueStatuses.includes("CANCELLED")) displayStatus = "CANCELLED";
    }
    
    const statusBadge = getStatusBadge(displayStatus);
    const StatusIcon = statusBadge.icon;
    const canUpdate = displayStatus !== "DELIVERED" && displayStatus !== "CANCELLED";
    const nextOptions = getNextStatusOptions(displayStatus);

    const handleBulkStatusUpdate = async () => {
        if (!selectedStatus) {
            toast.error("Please select a status to apply");
            return;
        }

        setShowConfirmModal(false);
        setIsUpdating(true);
        const toastId = toast.loading(`Updating order #${order.id.slice(0, 8).toUpperCase()} to ${selectedStatus}...`);

        try {
            const updatePromises = localItems.map(item =>
                updateOrderItemStatus(item.id, selectedStatus)
            );

            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => !r.success);
            const successfulUpdates = results.filter(r => r.success);

            if (errors.length > 0) {
                toast.error(`${errors.length} item(s) failed to update`, { id: toastId });
                
                const updatedItems = localItems.map(item => {
                    const successResult = successfulUpdates.find(r => r.data?.id === item.id);
                    if (successResult) {
                        return { ...item, status: selectedStatus };
                    }
                    return item;
                });
                setLocalItems(updatedItems);
            } else {
                toast.success(`${localItems.length} item(s) updated to ${selectedStatus}`, { id: toastId });
                setLocalItems(prev => prev.map(item => ({ ...item, status: selectedStatus })));
                
                if (onStatusUpdate) {
                    onStatusUpdate();
                }
                
                router.refresh();
            }

            setSelectedStatus("");
        } catch (error) {
            toast.error("Failed to update order status", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadgeForItem = (status: string) => {
        const badge = getStatusBadge(status);
        return (
            <Badge className={`${badge.color} text-white text-xs`}>
                <badge.icon className="h-2 w-2 mr-1" />
                {badge.label}
            </Badge>
        );
    };

    const selectedStatusLabel = nextOptions.find(opt => opt.value === selectedStatus)?.label || selectedStatus;

    return (
        <>
            <ConfirmModal
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
                onConfirm={handleBulkStatusUpdate}
                title="Confirm Status Update"
                description={`Are you sure you want to update ${localItems.length} item(s) to ${selectedStatusLabel?.toLowerCase()}? This action can be reverted.`}
                confirmText={`Update to ${selectedStatusLabel || "New Status"}`}
                cancelText="Cancel"
                isLoading={isUpdating}
            />

            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge className={`${statusBadge.color} text-white`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusBadge.label}
                                </Badge>
                                {isMixedStatus && (
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
                        
                        {/* Customer Info */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="ml-2 font-medium">{order.customer.name}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Contact:</span>
                                <span className="ml-2">{order.phone}</span>
                            </div>
                        </div>
                        
                        {/* Items Preview */}
                        <div className="mt-3">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {localItems.slice(0, 3).map((item, idx) => (
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
                                    {localItems.length} item{localItems.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Button variant="ghost" size="sm" onClick={onViewDetails}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                </Button>
                                
                                {canUpdate && nextOptions.length > 0 && !isMixedStatus && (
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="px-3 py-1.5 text-sm border rounded-md bg-background"
                                            disabled={isUpdating}
                                        >
                                            <option value="">Update Status</option>
                                            {nextOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    Mark as {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => setShowConfirmModal(true)}
                                            disabled={!selectedStatus || isUpdating}
                                            className="h-8"
                                        >
                                            {isUpdating ? "Updating..." : "Apply"}
                                        </Button>
                                    </div>
                                )}
                                
                                {isMixedStatus && (
                                    <p className="text-xs text-muted-foreground">
                                        Update individual items below
                                    </p>
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
                        
                        {/* Expanded Details - Items List */}
                        {expanded && (
                            <div className="mt-4 pt-4 border-t space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Items</p>
                                    <div className="space-y-2">
                                        {localItems.map((item) => (
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
                                                <div className="flex-shrink-0">
                                                    {getStatusBadgeForItem(item.status)}
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
                </CardContent>
            </Card>
        </>
    );
}