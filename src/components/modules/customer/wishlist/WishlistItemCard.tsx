"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";  // ✅ Add this import
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, Truck, Clock, AlertCircle, Pill } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { removeFromWishlist } from "@/actions/wishlist.action";
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

interface WishlistItem {
    id: string;
    medicineId: string;
    addedAt: string;
    medicine: {
        id: string;
        name: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        requiresPrescription: boolean;
        category: { id: string; name: string };
    };
}

interface WishlistItemCardProps {
    item: WishlistItem;
    isSelected: boolean;  // ✅ Add this
    onSelect: (checked: boolean) => void;  // ✅ Add this
    onRemove: (itemId: string) => void;
}

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

export function WishlistItemCard({ item, isSelected, onSelect, onRemove }: WishlistItemCardProps) {
    const router = useRouter();
    const { addToCart, isAdding } = useCart();
    const [isRemoving, setIsRemoving] = useState(false);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const isInStock = item.medicine.stock > 0;
    const isLowStock = item.medicine.stock > 0 && item.medicine.stock < 10;

    const handleAddToCart = async () => {
        if (!isInStock) {
            toast.error("This item is out of stock");
            return;
        }
        
        setIsAddingToCart(true);
        const success = await addToCart(item.medicine.id, 1);
        setIsAddingToCart(false);
        
        if (success) {
            toast.success("Added to cart");
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        const toastId = toast.loading("Removing from wishlist...");
        
        try {
            const result = await removeFromWishlist(item.medicine.id);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Removed from wishlist", { id: toastId });
                onRemove(item.id);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to remove item", { id: toastId });
        } finally {
            setIsRemoving(false);
            setShowRemoveDialog(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* ✅ Add Checkbox */}
                        <div className="flex-shrink-0 pt-1">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={onSelect}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Product Image */}
                            <Link href={`/shop/${item.medicine.id}`} className="flex-shrink-0">
                                <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                                    {isValidUrl(item.medicine.imageUrl) ? (
                                        <Image
                                            src={item.medicine.imageUrl!}
                                            alt={item.medicine.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-3xl"><Pill size={45}/></div>
                                    )}
                                </div>
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div>
                                        <Link 
                                            href={`/shop/${item.medicine.id}`}
                                            className="font-semibold hover:text-primary transition-colors"
                                        >
                                            {item.medicine.name}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {item.medicine.manufacturer}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {item.medicine.category.name}
                                            </Badge>
                                            {item.medicine.requiresPrescription && (
                                                <Badge variant="destructive" className="text-xs bg-red-500">
                                                    Rx Required
                                                </Badge>
                                            )}
                                            {isLowStock && isInStock && (
                                                <Badge variant="secondary" className="text-xs bg-yellow-500">
                                                    Only {item.medicine.stock} left
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">
                                            ${item.medicine.price.toFixed(2)}
                                        </p>
                                        {!isInStock && (
                                            <Badge variant="destructive" className="mt-1">
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Truck className="h-3 w-3" />
                                        <span>Free delivery over $50</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>2-4 business days</span>
                                    </div>
                                </div>

                                {/* Added Date */}
                                <p className="text-xs text-muted-foreground mt-2">
                                    Added on {formatDate(item.addedAt)}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        onClick={handleAddToCart}
                                        disabled={!isInStock || isAddingToCart}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                        {isAddingToCart ? "Adding..." : "Add to Cart"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => router.push(`/shop/${item.medicine.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowRemoveDialog(true)}
                                        disabled={isRemoving}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Remove Confirmation Dialog */}
            <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove "{item.medicine.name}" from your wishlist?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground">
                            {isRemoving ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}