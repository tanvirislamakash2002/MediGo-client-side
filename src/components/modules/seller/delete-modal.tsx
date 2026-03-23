"use client";

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

interface Medicine {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export function DeleteConfirmationModal({
    isOpen,
    medicine,
    onConfirm,
    onCancel,
    isLoading = false,
}: {
    isOpen: boolean;
    medicine: Medicine | null;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the medicine
                        {medicine && (
                            <div className="mt-2 p-3 bg-destructive/10 rounded-md">
                                <p className="font-semibold text-destructive">{medicine.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Price: ${medicine.price.toFixed(2)} | Stock: {medicine.stock}
                                </p>
                            </div>
                        )}
                        <p className="mt-2">
                            ⚠️ All order history associated with this medicine will be affected.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isLoading ? "Deleting..." : "Delete Permanently"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}