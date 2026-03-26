"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { changeUserRole, banUser, unbanUser } from "@/actions/user.action";
import { toast } from "sonner";

interface BulkActionsBarProps {
    selectedCount: number;
    selectedIds: string[];
    onClear: () => void;
    onRefresh: () => void;
    onBan: (userId: string) => Promise<void>;
    onUnban: (userId: string) => Promise<void>;
}

const roleOptions = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "SELLER", label: "Seller" },
    { value: "ADMIN", label: "Admin" },
];

export function BulkActionsBar({ selectedCount, selectedIds, onClear, onRefresh }: BulkActionsBarProps) {
    const [selectedRole, setSelectedRole] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleBulkRoleChange = async () => {
        if (!selectedRole) {
            toast.error("Please select a role to apply");
            return;
        }
        
        setIsUpdating(true);
        const toastId = toast.loading(`Updating ${selectedCount} users to ${selectedRole}...`);
        
        try {
            const updatePromises = selectedIds.map(userId =>
                changeUserRole(userId, selectedRole)
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => r.error);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} users failed to update`, { id: toastId });
            } else {
                toast.success(`${selectedCount} users updated to ${selectedRole}`, { id: toastId });
                onRefresh();
                onClear();
            }
        } catch (error) {
            toast.error("Failed to update users", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBulkBan = async () => {
        setIsUpdating(true);
        const toastId = toast.loading(`Banning ${selectedCount} users...`);
        
        try {
            const updatePromises = selectedIds.map(userId =>
                banUser(userId)
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => r.error);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} users failed to ban`, { id: toastId });
            } else {
                toast.success(`${selectedCount} users banned`, { id: toastId });
                onRefresh();
                onClear();
            }
        } catch (error) {
            toast.error("Failed to ban users", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBulkUnban = async () => {
        setIsUpdating(true);
        const toastId = toast.loading(`Unbanning ${selectedCount} users...`);
        
        try {
            const updatePromises = selectedIds.map(userId =>
                unbanUser(userId)
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => r.error);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} users failed to unban`, { id: toastId });
            } else {
                toast.success(`${selectedCount} users unbanned`, { id: toastId });
                onRefresh();
                onClear();
            }
        } catch (error) {
            toast.error("Failed to unban users", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-muted/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                    {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
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
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-md bg-background flex-1 sm:flex-initial"
                >
                    <option value="">Bulk Change Role...</option>
                    {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            Make {option.label}
                        </option>
                    ))}
                </select>
                <Button 
                    onClick={handleBulkRoleChange}
                    disabled={!selectedRole || isUpdating}
                    size="sm"
                >
                    Apply Role
                </Button>
                
                <Button 
                    variant="destructive" 
                    onClick={handleBulkBan}
                    disabled={isUpdating}
                    size="sm"
                >
                    Ban Selected
                </Button>
                
                <Button 
                    variant="outline" 
                    onClick={handleBulkUnban}
                    disabled={isUpdating}
                    size="sm"
                >
                    Unban Selected
                </Button>
            </div>
        </div>
    );
}