"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { 
        cart, 
        cartCount, 
        cartTotal, 
        updateCartItem, 
        removeCartItem 
    } = useCart();

    const handleUpdateQuantity = (itemId: string, currentQuantity: number, stock: number, delta: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;
        if (newQuantity > stock) {
            toast.error(`Only ${stock} items available`);
            return;
        }
        updateCartItem(itemId, newQuantity);
    };

    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:w-[450px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Shopping Cart ({cartCount})
                    </SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button onClick={onClose} asChild>
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4 py-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                            {isValidUrl(item.imageUrl) ? (
                                                <Image
                                                    src={item.imageUrl!}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-2xl">💊</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                            <p className="text-sm font-semibold mt-1">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, item.stock, -1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, item.stock, 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => removeCartItem(item.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="border-t pt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={onClose} asChild>
                                    <Link href="/cart">View Cart</Link>
                                </Button>
                                <Button className="flex-1" asChild>
                                    <Link href="/checkout">Checkout</Link>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}