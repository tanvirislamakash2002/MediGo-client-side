"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Package, Truck, CheckCircle, XCircle, Clock,
    MapPin, Phone, Mail, Printer, MessageSquare, User,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { updateOrderStatus, cancelOrder, adminUpdateOrderStatus, adminCancelOrder } from "@/actions/order.action";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address?: string;
    };
    items: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        manufacturer: string;
        imageUrl?: string;
    }>;
    shippingAddress: string;
    phone: string;
    deliveryInstructions?: string;
    paymentMethod: string;
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
            return { icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", label: "Placed" };
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

export function OrderDetailsModal({ isOpen, order, onClose, onRefresh }: OrderDetailsModalProps) {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [note, setNote] = useState("");
    const [activeTab, setActiveTab] = useState<"details" | "items">("details");
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

    if (!order) return null;

    const status = getStatusDetails(order.status);
    const StatusIcon = status.icon;
    const canUpdate = order.status !== "CANCELLED" && order.status !== "DELIVERED";
    const canCancel = order.status !== "CANCELLED" && order.status !== "DELIVERED";

    const statusOptions = [
        { value: "PROCESSING", label: "Processing" },
        { value: "SHIPPED", label: "Shipped" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const handleStatusUpdate = async () => {
        if (!selectedStatus) return;

        setIsUpdating(true);
        const toastId = toast.loading(`Updating order status...`);

        try {
            const result = await adminUpdateOrderStatus(order.id, selectedStatus);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success(`Order status updated to ${selectedStatus}`, { id: toastId });
                onRefresh();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to update order", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = async () => {
        setIsUpdating(true);
        const toastId = toast.loading("Cancelling order...");

        try {
            const result = await adminCancelOrder(order.id);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Order cancelled successfully", { id: toastId });
                onRefresh();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to cancel order", { id: toastId });
        } finally {
            setIsUpdating(false);
            setShowCancelDialog(false);
            setCancelReason("");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleContactCustomer = () => {
        window.location.href = `mailto:${order.customer.email}?subject=Order #${order.id.slice(0, 8)} Inquiry`;
    };

    // Desktop Modal Content
    const DesktopContent = () => (
        <div className="space-y-6">
            {/* Status Banner - Responsive */}
            <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg ${status.bg}`}>
                <div className="flex items-center gap-3">
                    <StatusIcon className={`h-6 w-6 ${status.color}`} />
                    <div>
                        <p className="font-semibold">{status.label}</p>
                        <p className="text-sm text-muted-foreground">
                            Order placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleContactCustomer}>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                    </Button>
                </div>
            </div>

            {/* Desktop Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <h3 className="font-semibold">Customer Information</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="break-words">
                                    <p className="font-medium">{order.customer.name}</p>
                                    <p className="text-sm text-muted-foreground break-all">{order.customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                <p className="text-sm break-all">{order.customer.phone}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-sm break-words whitespace-pre-wrap">{order.shippingAddress}</p>
                            </div>
                            {order.deliveryInstructions && (
                                <div className="mt-2 p-2 bg-muted/20 rounded">
                                    <p className="text-xs text-muted-foreground">Delivery Instructions:</p>
                                    <p className="text-sm break-words">{order.deliveryInstructions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items - Scrollable on mobile */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <h3 className="font-semibold">Items ({order.items.length})</h3>
                        </div>
                        <ScrollArea className="max-h-[300px] md:max-h-[400px]">
                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:justify-between gap-3">
                                        <div className="flex gap-3 flex-1">
                                            {/* Add image */}
                                            {item.imageUrl && (
                                                <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium break-words">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <h3 className="font-semibold">Order Summary</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between text-sm flex-wrap gap-2">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm flex-wrap gap-2">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold flex-wrap gap-2">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                                <p className="text-sm text-muted-foreground break-words">Payment Method: Cash on Delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <h3 className="font-semibold">Admin Actions</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {canUpdate && (
                                <div className="space-y-2">
                                    <Label>Update Status</Label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                                        >
                                            <option value="">Select status...</option>
                                            {statusOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    Mark as {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            onClick={handleStatusUpdate}
                                            disabled={!selectedStatus || isUpdating}
                                            size="sm"
                                            className="w-full sm:w-auto"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {canCancel && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setShowCancelDialog(true)}
                                >
                                    Cancel Order
                                </Button>
                            )}

                            <div className="space-y-2">
                                <Label>Internal Note</Label>
                                <Textarea
                                    placeholder="Add internal note about this order..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                                <Button variant="outline" size="sm" className="w-full">
                                    Save Note
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Mobile Bottom Sheet Content
    const MobileContent = () => (
        <div className="space-y-3 p-3">
            {/* Status Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-lg ${status.bg}`}>
                <StatusIcon className={`h-6 w-6 ${status.color}`} />
                <div>
                    <p className="font-semibold">{status.label}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "details"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground"
                        }`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveTab("items")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "items"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground"
                        }`}
                >
                    Items ({order.items.length})
                </button>
            </div>

            {/* Tab Content */}
            <ScrollArea className="max-h-[60vh]">
                {activeTab === "details" ? (
                    <div className="space-y-4">
                        {/* Customer Info */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold">Customer</h3>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="text-muted-foreground">Name:</span> {order.customer.name}</p>
                                <p className="text-sm break-all"><span className="text-muted-foreground">Email:</span> {order.customer.email}</p>
                                <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {order.customer.phone}</p>
                                <p className="text-sm"><span className="text-muted-foreground">Address:</span> {order.shippingAddress}</p>
                                {order.deliveryInstructions && (
                                    <p className="text-sm"><span className="text-muted-foreground">Instructions:</span> {order.deliveryInstructions}</p>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border rounded-lg p-4 space-y-2">
                            <h3 className="font-semibold">Summary</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold">Actions</h3>
                            {canUpdate && (
                                <div className="space-y-2">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                                    >
                                        <option value="">Update Status...</option>
                                        {statusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                Mark as {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        disabled={!selectedStatus || isUpdating}
                                        className="w-full"
                                        size="sm"
                                    >
                                        Apply
                                    </Button>
                                </div>
                            )}
                            {canCancel && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setShowCancelDialog(true)}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handleContactCustomer}
                            >
                                <Mail className="h-4 w-4" />
                                Contact Customer
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={handlePrint}
                            >
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4">
                                <div className="flex gap-3">
                                    {item.imageUrl && (
                                        <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium break-words">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm">${item.price.toFixed(2)} × {item.quantity}</span>
                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );

    // Use responsive dialog with different content for mobile/desktop
    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="w-[calc(100%-1rem)] sm:w-[95vw] max-w-4xl max-h-[90vh] p-2 sm:p-6 overflow-y-auto mx-auto">
                    <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                        <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span>Order Details</span>
                            <span className="text-sm font-mono text-muted-foreground">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Hide on mobile, show on desktop */}
                    <div className="hidden lg:block">
                        <DesktopContent />
                    </div>

                    {/* Show on mobile, hide on desktop */}
                    <div className="block lg:hidden">
                        <MobileContent />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Cancel Confirmation Dialog - Already responsive */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent className="w-[calc(100%-1rem)] max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2">
                                <p>Are you sure you want to cancel order #{order.id.slice(0, 8).toUpperCase()}?</p>

                                <p className="text-sm font-medium">Items:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {order.items.slice(0, 3).map((item) => (
                                        <li key={item.id}>{item.quantity}x {item.name}</li>
                                    ))}
                                    {order.items.length > 3 && (
                                        <li className="text-muted-foreground">+{order.items.length - 3} more items</li>
                                    )}
                                </ul>

                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="reason">Reason (optional)</Label>
                                    <Input
                                        id="reason"
                                        placeholder="e.g., Out of stock, Customer request"
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                    />
                                </div>

                                <p className="text-destructive text-sm pt-2">This action will restore stock and cannot be undone.</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Keep Order</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancel}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                        >
                            Yes, Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}