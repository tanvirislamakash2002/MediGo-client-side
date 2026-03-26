"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface ChangeRoleModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onConfirm: (userId: string, newRole: string) => Promise<void>;
}

const roleOptions = [
    { value: "CUSTOMER", label: "Customer", description: "Can browse and purchase medicines" },
    { value: "SELLER", label: "Seller", description: "Can list medicines and manage orders" },
    { value: "ADMIN", label: "Admin", description: "Full platform access" },
];

export function ChangeRoleModal({ isOpen, user, onClose, onConfirm }: ChangeRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState(user?.role || "CUSTOMER");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) return null;

    const handleConfirm = async () => {
        if (selectedRole === user.role) {
            onClose();
            return;
        }
        
        setIsSubmitting(true);
        await onConfirm(user.id, selectedRole);
        setIsSubmitting(false);
    };

    const getWarningMessage = () => {
        if (user.role === "ADMIN" && selectedRole !== "ADMIN") {
            return "⚠️ Warning: This will remove admin privileges from this user.";
        }
        if (user.role !== "ADMIN" && selectedRole === "ADMIN") {
            return "⚠️ Warning: This will give full admin access to this user.";
        }
        if (selectedRole === "SELLER") {
            return "📦 User will gain access to seller dashboard and product management.";
        }
        return null;
    };

    const warning = getWarningMessage();

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change User Role</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <p>
                                User: <span className="font-semibold">{user.name}</span>
                                <br />
                                Email: <span className="text-muted-foreground">{user.email}</span>
                                <br />
                                Current Role: <span className="font-semibold capitalize">{user.role.toLowerCase()}</span>
                            </p>
                            
                            <div className="space-y-2">
                                <Label>New Role</Label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                                >
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label} - {option.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {warning && (
                                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                        {warning}
                                    </p>
                                </div>
                            )}
                            
                            <p className="text-destructive text-sm pt-2">
                                This action will be logged for audit purposes.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Changing..." : "Confirm Change"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}