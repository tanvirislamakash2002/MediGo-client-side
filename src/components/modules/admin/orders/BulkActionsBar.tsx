"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { adminUpdateOrderStatus, updateOrderStatus } from "@/actions/order.action";
import { toast } from "sonner";

interface BulkActionsBarProps {
    selectedCount: number;
    selectedIds: string[];
    onClear: () => void;
    onRefresh: () => void;
}

const bulkStatusOptions = [
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

export function BulkActionsBar({ selectedCount, selectedIds, onClear, onRefresh }: BulkActionsBarProps) {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleBulkUpdate = async () => {
        if (!selectedStatus) {
            toast.error("Please select a status to apply");
            return;
        }
        
        setIsUpdating(true);
        const toastId = toast.loading(`Updating ${selectedCount} orders to ${selectedStatus}...`);
        
        try {
            const updatePromises = selectedIds.map(orderId =>
                adminUpdateOrderStatus(orderId, selectedStatus)
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => r.error);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} orders failed to update`, { id: toastId });
            } else {
                toast.success(`${selectedCount} orders updated to ${selectedStatus}`, { id: toastId });
                onRefresh();
                onClear();
            }
        } catch (error) {
            toast.error("Failed to update orders", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-muted/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                    {selectedCount} order{selectedCount !== 1 ? 's' : ''} selected
                </span>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClear}
                    className="text-muted-foreground"
                >
                    Clear
                </Button>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-md bg-background flex-1 sm:flex-initial"
                >
                    <option value="">Bulk Update Status...</option>
                    {bulkStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            Mark as {option.label}
                        </option>
                    ))}
                </select>
                <Button 
                    onClick={handleBulkUpdate}
                    disabled={!selectedStatus || isUpdating}
                    size="sm"
                >
                    {isUpdating ? "Updating..." : "Apply"}
                </Button>
            </div>
        </div>
    );
}