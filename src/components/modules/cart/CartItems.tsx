"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, AlertCircle, Plus, Minus, Pill } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { updateCartItem, removeCartItem } from "@/actions/cart.action";
import { CartItem } from "@/types/cart.type";

interface CartItemsProps {
    initialItems: CartItem[];
    onSelectionChange?: (selectedItems: CartItem[], total: number) => void;
}

export function CartItems({ initialItems, onSelectionChange }: CartItemsProps) {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectAll, setSelectAll] = useState(false);

    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    // Update parent component when selection changes
    const updateSelection = (newSelected: Set<string>) => {
        setSelectedItems(newSelected);
        const selected = items.filter(item => newSelected.has(item.id));
        const total = selected.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        onSelectionChange?.(selected, total);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(items.map(item => item.id));
            setSelectedItems(allIds);
            updateSelection(allIds);
        } else {
            setSelectedItems(new Set());
            updateSelection(new Set());
        }
        setSelectAll(checked);
    };

    const handleSelectItem = (itemId: string, checked: boolean) => {
        const newSelected = new Set(selectedItems);
        if (checked) {
            newSelected.add(itemId);
        } else {
            newSelected.delete(itemId);
        }
        setSelectedItems(newSelected);
        updateSelection(newSelected);
        setSelectAll(newSelected.size === items.length);
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
            if (!result.success) {
                toast.error(result.message);
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
            if (!result.success) {
                toast.error(result.message);
            } else {
                setItems(prev => prev.filter(item => item.id !== itemId));
                // Remove from selected items
                const newSelected = new Set(selectedItems);
                newSelected.delete(itemId);
                setSelectedItems(newSelected);
                updateSelection(newSelected);
                toast.success(`${itemName} removed from cart`);

                // Refresh the page to update cart data
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleRemoveSelected = async () => {
        if (selectedItems.size === 0) return;

        const toastId = toast.loading(`Removing ${selectedItems.size} items...`);
        const itemsToRemove = items.filter(item => selectedItems.has(item.id));

        try {
            for (const item of itemsToRemove) {
                await removeCartItem(item.id);
            }

            const remainingItems = items.filter(item => !selectedItems.has(item.id));
            setItems(remainingItems);
            setSelectedItems(new Set());
            updateSelection(new Set());
            setSelectAll(false);

            toast.success(`${itemsToRemove.length} items removed`, { id: toastId });

            // Refresh the page to update cart data
            router.refresh();
        } catch (error) {
            toast.error("Failed to remove items", { id: toastId });
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Selection Controls */}
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="select-all"
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                    />
                    <label
                        htmlFor="select-all"
                        className="text-sm font-medium cursor-pointer"
                    >
                        Select All ({items.length} items)
                    </label>
                </div>
                {selectedItems.size > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveSelected}
                        className="h-8"
                    >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove Selected ({selectedItems.size})
                    </Button>
                )}
            </div>

            {/* Cart Items */}
            {items.map((item: CartItem) => (
                <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Selection Checkbox */}
                            <div className="flex items-start">
                                <Checkbox
                                    checked={selectedItems.has(item.id)}
                                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                                    className="mt-1"
                                />
                            </div>

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
                                        <Pill size={45} />
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