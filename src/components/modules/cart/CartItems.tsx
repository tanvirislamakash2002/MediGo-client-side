"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertCircle, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { updateCartItem, removeCartItem } from "@/actions/cart.action";

interface CartItem {
    id: string;
    medicineId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
}

interface CartItemsProps {
    initialItems: CartItem[];
}

export function CartItems({ initialItems }: CartItemsProps) {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    const handleQuantityChange = async (itemId: string, newQuantity: number, stock: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > stock) {
            toast.error(`Only ${stock} items available`);
            return;
        }

        setUpdatingId(itemId);
        try {
            const result = await updateCartItem(itemId, newQuantity);
            if (result.error) {
                toast.error(result.error.message);
            } else {
                setItems(prev => prev.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                ));
                toast.success("Quantity updated");
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (itemId: string, itemName: string) => {
        try {
            const result = await removeCartItem(itemId);
            if (result.error) {
                toast.error(result.error.message);
            } else {
                setItems(prev => prev.filter(item => item.id !== itemId));
                toast.success(`${itemName} removed from cart`);

                // Refresh page if cart becomes empty
                if (items.length === 1) {
                    router.refresh();
                }
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                                {isValidUrl(item.imageUrl) ? (
                                    <Image
                                        src={item.imageUrl!}
                                        alt={item.name}
                                        width={112}
                                        height={112}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-3xl text-muted-foreground">
                                        💊
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 space-y-2">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.manufacturer}
                                            </p>
                                        </div>
                                        <span className="font-bold text-lg text-primary">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>

                                    {item.requiresPrescription && (
                                        <Badge variant="outline" className="mt-1 bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Prescription Required
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Qty:</span>
                                        <div className="flex items-center border rounded-md">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-none"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                                disabled={updatingId === item.id || item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1, item.stock)}
                                                className="w-12 h-8 text-center border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                min={1}
                                                max={item.stock}
                                                disabled={updatingId === item.id}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-none"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                                disabled={updatingId === item.id || item.quantity >= item.stock}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        {item.stock < 10 && (
                                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                                Only {item.stock} left
                                            </span>
                                        )}
                                    </div>

                                    {/* Price per unit */}
                                    <div className="text-sm text-muted-foreground">
                                        ${item.price.toFixed(2)} each
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRemoveItem(item.id, item.name)}
                                        disabled={updatingId === item.id}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}