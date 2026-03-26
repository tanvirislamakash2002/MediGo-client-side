"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, MessageSquare, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/order.action";

interface Order {
    id: string;
    status: string;
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
    const nextStatus = getNextStatusOptions(order.status);
    const canCancel = order.status === "PLACED" || order.status === "PROCESSING";

    const handleStatusUpdate = async () => {
        if (!nextStatus) return;
        
        setIsUpdating(true);
        const toastId = toast.loading(`Updating order to ${nextStatus.label}...`);
        
        try {
            const result = await updateOrderStatus(order.id, nextStatus.value);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success(`Order updated to ${nextStatus.label}`, { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update order", { id: toastId });
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
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {nextStatus && (
                    <Button
                        variant="default"
                        className="w-full"
                        onClick={handleStatusUpdate}
                        disabled={isUpdating}
                    >
                        {nextStatus.icon && <nextStatus.icon className="h-4 w-4 mr-2" />}
                        Mark as {nextStatus.label}
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
    );
}