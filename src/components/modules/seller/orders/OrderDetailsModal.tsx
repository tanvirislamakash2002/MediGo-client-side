"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, Printer, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { updateOrderStatus } from "@/actions/order.action";
import { toast } from "sonner";
import { useState } from "react";

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

interface OrderDetailsModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    onRefresh: () => void;
}

const getStatusDetails = (status: string) => {
    switch (status) {
        case "PLACED":
            return { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", label: "Pending" };
        case "PROCESSING":
            return { icon: Package, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30", label: "Processing" };
        case "SHIPPED":
            return { icon: Truck, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30", label: "Shipped" };
        case "DELIVERED":
            return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30", label: "Delivered" };
        case "CANCELLED":
            return { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", label: "Cancelled" };
        default:
            return { icon: Clock, color: "text-gray-500", bg: "bg-gray-50", label: status };
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

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

export function OrderDetailsModal({ isOpen, order, onClose, onRefresh }: OrderDetailsModalProps) {
    const [updating, setUpdating] = useState(false);
    
    if (!order) return null;
    
    const status = getStatusDetails(order.status);
    const StatusIcon = status.icon;
    const canUpdateStatus = order.status !== "DELIVERED" && order.status !== "CANCELLED";
    const canCancel = order.status === "PLACED" || order.status === "PROCESSING";

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            const result = await updateOrderStatus(order.id, newStatus);
            if (result.error) {
                toast.error(result.error.message);
            } else {
                toast.success(`Order status updated to ${newStatus}`);
                onRefresh();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to update order status");
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleContactCustomer = () => {
        window.location.href = `mailto:${order.customer.email}?subject=Order #${order.id.slice(0, 8)}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Order Details
                        <span className="text-sm font-mono text-muted-foreground">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Status Banner */}
                    <div className={`flex items-center gap-3 p-4 rounded-lg ${status.bg}`}>
                        <StatusIcon className={`h-6 w-6 ${status.color}`} />
                        <div>
                            <p className="font-semibold">{status.label}</p>
                            <p className="text-sm text-muted-foreground">
                                Order placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    
                    {/* Items */}
                    <div>
                        <h4 className="font-semibold mb-3">Items</h4>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                        {isValidUrl(item.imageUrl) ? (
                                            <Image src={item.imageUrl!} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-2xl">💊</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.manufacturer}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Customer Information */}
                    <div>
                        <h4 className="font-semibold mb-3">Customer Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">{order.customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm">{order.customer.phone}</p>
                            </div>
                            <div className="flex items-start gap-2 sm:col-span-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm">{order.shippingAddress}</p>
                            </div>
                        </div>
                        {order.deliveryInstructions && (
                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium mb-1">Delivery Instructions</p>
                                <p className="text-sm text-muted-foreground">{order.deliveryInstructions}</p>
                            </div>
                        )}
                    </div>
                    
                    <Separator />
                    
                    {/* Order Summary */}
                    <div>
                        <h4 className="font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>$0.00</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleContactCustomer}
                            className="gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Contact Customer
                        </Button>
                        
                        {canUpdateStatus && (
                            <select
                                className="px-3 py-2 text-sm border rounded-md bg-background"
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                value=""
                                disabled={updating}
                            >
                                <option value="" disabled>Update Status</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
                        )}
                        
                        {canCancel && (
                            <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleStatusUpdate("CANCELLED")}
                                disabled={updating}
                            >
                                Cancel Order
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}