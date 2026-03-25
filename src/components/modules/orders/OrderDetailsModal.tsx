"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, FileText } from "lucide-react";
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

interface OrderDetailsModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    onReorder: (order: Order) => void;
    onCancel: (order: Order) => void;
}

const getStatusDetails = (status: string) => {
    switch (status) {
        case "PLACED":
            return { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", label: "Order Placed" };
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

export function OrderDetailsModal({ isOpen, order, onClose, onReorder, onCancel }: OrderDetailsModalProps) {
    if (!order) return null;
    
    const status = getStatusDetails(order.status);
    const StatusIcon = status.icon;
    const canCancel = order.status === "PLACED" || order.status === "PROCESSING";
    const canReorder = order.status === "DELIVERED";

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
                                {order.status === "DELIVERED" 
                                    ? `Delivered on ${formatDate(order.createdAt)}`
                                    : order.estimatedDeliveryDate 
                                        ? `Estimated delivery: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}`
                                        : "Your order is being processed"}
                            </p>
                        </div>
                    </div>
                    
                    {/* Order Timeline */}
                    <div>
                        <h4 className="font-semibold mb-3">Order Timeline</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "PLACED" ? "bg-blue-500 text-white" : "bg-muted"}`}>
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Order Placed</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED" ? "bg-blue-500 text-white" : "bg-muted"}`}>
                                    <Package className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Processing</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED" 
                                            ? "Order confirmed and being prepared"
                                            : "Pending"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "SHIPPED" || order.status === "DELIVERED" ? "bg-blue-500 text-white" : "bg-muted"}`}>
                                    <Truck className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Shipped</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.status === "SHIPPED" || order.status === "DELIVERED" 
                                            ? "Order has been shipped"
                                            : "Pending"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === "DELIVERED" ? "bg-green-500 text-white" : "bg-muted"}`}>
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Delivered</p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.status === "DELIVERED" 
                                            ? "Order delivered successfully"
                                            : "Pending"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Separator />
                    
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
                                        {item.requiresPrescription && (
                                            <Badge variant="outline" className="mt-1 text-xs bg-red-50 text-red-700">
                                                Prescription Required
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${item.price.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <h4 className="font-semibold">Shipping Address</h4>
                            </div>
                            <p className="text-sm">{order.shippingAddress}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{order.phone}</p>
                            </div>
                            {order.deliveryInstructions && (
                                <div className="mt-2">
                                    <p className="text-xs text-muted-foreground">Delivery Instructions:</p>
                                    <p className="text-sm">{order.deliveryInstructions}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <h4 className="font-semibold">Payment Method</h4>
                            </div>
                            <p className="text-sm">Cash on Delivery</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pay with cash when your order arrives
                            </p>
                        </div>
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
                    <div className="flex gap-3 pt-4">
                        {canReorder && (
                            <Button onClick={() => onReorder(order)} className="flex-1">
                                Reorder
                            </Button>
                        )}
                        {canCancel && (
                            <Button onClick={() => onCancel(order)} variant="destructive" className="flex-1">
                                Cancel Order
                            </Button>
                        )}
                        <Button onClick={onClose} variant="outline" className="flex-1">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}