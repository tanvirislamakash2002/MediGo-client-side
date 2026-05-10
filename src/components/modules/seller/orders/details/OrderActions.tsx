"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Printer, MessageSquare, Package, Truck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderItemStatus } from "@/actions/order.action";

interface OrderItem {
    id: string;
    status: string;
}

interface Order {
    id: string;
    status: string;
    items: OrderItem[];
}

interface OrderActionsProps {
    order: Order;
}

const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
        case "PLACED":
            return { value: "PROCESSING", label: "Processing", icon: Package, color: "bg-yellow-500" };
        case "PROCESSING":
            return { value: "SHIPPED", label: "Shipped", icon: Truck, color: "bg-purple-500" };
        case "SHIPPED":
            return { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "bg-green-500" };
        default:
            return null;
    }
};

export function OrderActions({ order }: OrderActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    
    const nextStatus = getNextStatusOptions(order.status);
    const canCancel = order.status === "PLACED" || order.status === "PROCESSING";

    const handleStatusUpdate = async () => {
        if (!nextStatus) return;
        
        setShowStatusModal(false);
        setIsUpdating(true);
        const toastId = toast.loading(`Updating order items to ${nextStatus.label}...`);
        
        try {
            const updatePromises = order.items.map(item =>
                updateOrderItemStatus(item.id, nextStatus.value)
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => !r.success);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} item(s) failed to update`, { id: toastId });
            } else {
                toast.success(`All items updated to ${nextStatus.label}`, { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update order", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelOrder = async () => {
        setShowCancelModal(false);
        setIsUpdating(true);
        const toastId = toast.loading("Cancelling order...");
        
        try {
            const updatePromises = order.items.map(item =>
                updateOrderItemStatus(item.id, "CANCELLED")
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => !r.success);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} item(s) failed to cancel`, { id: toastId });
            } else {
                toast.success("Order cancelled successfully", { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to cancel order", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleContactCustomer = () => {
        toast.info("Contact customer feature coming soon");
    };

    return (
        <>
            {/* Status Update Confirmation Modal */}
            <AlertDialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="text-sm text-muted-foreground">
                                <p>Are you sure you want to update all {order.items.length} item(s) in this order to {nextStatus?.label?.toLowerCase()}?</p>
                                <br />
                                <p>This action will:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Change the status of all your products in this order</li>
                                    <li>Notify the customer about the update</li>
                                    <li>Cannot be undone for shipped or delivered items</li>
                                </ul>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleStatusUpdate} disabled={isUpdating}>
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                nextStatus?.icon && <nextStatus.icon className="h-4 w-4 mr-2" />
                            )}
                            Confirm Update
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Order Confirmation Modal */}
            <AlertDialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Order Cancellation</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="text-sm text-muted-foreground">
                                <p>Are you sure you want to cancel this order?</p>
                                <br />
                                <p>This action will:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Cancel all {order.items.length} item(s) in this order</li>
                                    <li>Restore the stock quantities</li>
                                    <li>Notify the customer about the cancellation</li>
                                    <li>Cannot be undone</li>
                                </ul>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Go Back</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleCancelOrder} 
                            disabled={isUpdating}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Yes, Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    {nextStatus && (
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() => setShowStatusModal(true)}
                            disabled={isUpdating}
                        >
                            {nextStatus.icon && <nextStatus.icon className="h-4 w-4 mr-2" />}
                            Mark as {nextStatus.label}
                        </Button>
                    )}
                    
                    {canCancel && (
                        <Button
                            variant="destructive"
                            className="w-full"
                            disabled={isUpdating}
                            onClick={() => setShowCancelModal(true)}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                        </Button>
                    )}
                                    
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handlePrint}
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Print Order
                    </Button>
                    
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleContactCustomer}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Customer
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}