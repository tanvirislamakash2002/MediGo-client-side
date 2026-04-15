"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ShoppingCart,
    XCircle,
    MessageSquare,
    Download,
    Package
} from "lucide-react";
import { toast } from "sonner";
import { cancelOrder } from "@/actions/order.action";
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

interface Order {
    id: string;
    status: string;
    items?: Array<{ id: string; name?: string; medicineId?: string; quantity: number }>;
}

interface OrderActionsProps {
    order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
    const router = useRouter();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Safe checks
    if (!order) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    const canCancel = order.status === "PLACED" || order.status === "PROCESSING";
    const canReorder = order.status === "DELIVERED";
    const canTrack = order.status === "SHIPPED";
    const items = order.items || [];

    const handleCancel = async () => {
        setIsCancelling(true);
        const toastId = toast.loading("Cancelling order...");

        try {
            const result = await cancelOrder(order.id);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Order cancelled successfully", { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to cancel order", { id: toastId });
        } finally {
            setIsCancelling(false);
            setShowCancelDialog(false);
        }
    };

    const handleReorder = async () => {
        // Add all items to cart logic here
        toast.success("Items added to cart");
        router.push("/cart");
    };

    const handleTrackOrder = () => {
        toast.info("Tracking information will be available soon");
    };

    const handleContactSupport = () => {
        window.location.href = "mailto:support@medigo.com?subject=Order Inquiry";
    };

    const handleDownloadInvoice = () => {
        toast.success("Invoice downloaded");
    };

    return (
        <>
            <Card>
                <CardHeader className="border-b">
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    {canReorder && (
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={handleReorder}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Reorder
                        </Button>
                    )}

                    {canTrack && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleTrackOrder}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Track Order
                        </Button>
                    )}

                    {canCancel && (
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => setShowCancelDialog(true)}
                            disabled={isCancelling}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            {isCancelling ? "Cancelling..." : "Cancel Order"}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleContactSupport}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Support
                    </Button>

                    {/* <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleDownloadInvoice}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                    </Button> */}
                </CardContent>
            </Card>

            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div>
                                Are you sure you want to cancel order #{order.id.slice(0, 8).toUpperCase()}?
                                <br />
                                <br />
                                <strong>Items in this order:</strong>
                                <ul className="mt-2 space-y-1">
                                    {items.slice(0, 3).map((item) => (
                                        <li key={item.id} className="text-sm">
                                            {item.quantity}x {item.name || item.id.slice(0, 8)}
                                        </li>
                                    ))}
                                    {items.length > 3 && (
                                        <li className="text-sm text-muted-foreground">
                                            +{items.length - 3} more items
                                        </li>
                                    )}
                                </ul>
                                <br />
                                <span className="text-destructive">
                                    This action cannot be undone.
                                </span>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancel}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}