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

interface Category {
    id: string;
    name: string;
    productCount: number;
}

interface DeleteCategoryModalProps {
    isOpen: boolean;
    category: Category | null;
    onConfirm: () => void;
    onClose: () => void;
}

export function DeleteCategoryModal({ isOpen, category, onConfirm, onClose }: DeleteCategoryModalProps) {
    if (!category) return null;

    const hasProducts = category.productCount > 0;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{category.name}"?
                        {hasProducts ? (
                            <>
                                <br />
                                <br />
                                <span className="text-destructive font-medium">
                                    This category contains {category.productCount} product{category.productCount !== 1 ? 's' : ''}.
                                </span>
                                <br />
                                You cannot delete a category that has products. Please reassign or delete the products first.
                            </>
                        ) : (
                            <>
                                <br />
                                <br />
                                This action cannot be undone.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {!hasProducts && (
                        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete Category
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}