"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Truck, Clock, Gift, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { OrderSummaryProps } from "@/types/order.type";

export function OrderSummary({
    subtotal,
    shippingCost,
    tax,
    total,
    freeShippingThreshold,
    selectedItems = [],
    selectedTotal = 0,
    onCheckout
}: OrderSummaryProps) {
    const router = useRouter();
    const [promoCode, setPromoCode] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [discount, setDiscount] = useState(0);

    const hasSelectedItems = selectedItems.length > 0;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - selectedTotal);
    const freeShippingProgress = Math.min(100, (selectedTotal / freeShippingThreshold) * 100);

    const handleApplyPromo = async () => {
        if (!promoCode) return;

        setIsApplyingPromo(true);
        setTimeout(() => {
            if (promoCode.toUpperCase() === "RAMADAN30") {
                setDiscount(selectedTotal * 0.3);
                toast.success("Promo code applied! 30% discount");
            }
            else if (promoCode.toUpperCase() === "FREESHIP") {
                setDiscount(selectedTotal * 0.1);
                toast.success("Promo code applied! 10% discount");
            }
            else if (promoCode.toUpperCase() === "WINTER25") {
                setDiscount(selectedTotal * 0.25);
                toast.success("Promo code applied! 25% discount");
            }
            else if (promoCode.toUpperCase() === "MEDIGO20") {
                setDiscount(selectedTotal * 0.2);
                toast.success("Promo code applied! 20% discount");
            }
            else {
                toast.error("Invalid promo code");
            }
            setIsApplyingPromo(false);
        }, 500);
    };

    const handleCheckout = () => {
        
        if (!hasSelectedItems) {
            toast.error("Please select at least one item to checkout");
            return;
        }

        // Use the passed handler if available
        if (onCheckout) {
            onCheckout();
        } else {
            router.push("/checkout");
        }
    };

    const finalTotal = selectedTotal - discount + (selectedTotal > 0 ? (selectedTotal > freeShippingThreshold ? 0 : shippingCost) : 0);

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Alert for no items selected */}
                {!hasSelectedItems && (
                    <Alert variant="default" className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                            No items selected. Please select items from your cart to proceed with checkout.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Free Shipping Progress - only show if items selected */}
                {hasSelectedItems && remainingForFreeShipping > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Add ${remainingForFreeShipping.toFixed(2)} more for</span>
                            <span className="font-medium text-green-600 dark:text-green-400">FREE SHIPPING</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${freeShippingProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Selected Items Count */}
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Selected Items</span>
                    <span>{selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}</span>
                </div>

                {/* Totals - only show if items selected */}
                {hasSelectedItems ? (
                    <>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${selectedTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                {selectedTotal > freeShippingThreshold ? (
                                    <span className="text-green-600 dark:text-green-400">FREE</span>
                                ) : (
                                    <span>${shippingCost.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleApplyPromo}
                                    disabled={isApplyingPromo || !promoCode}
                                >
                                    {isApplyingPromo ? "Applying..." : "Apply"}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 text-muted-foreground">
                        <p>Select items to see order details</p>
                    </div>
                )}

                {/* Checkout Button */}
                <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                    disabled={!hasSelectedItems}
                >
                    Proceed to Checkout
                </Button>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>100% Genuine Medicines</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        <span>Free delivery on orders over ${freeShippingThreshold}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Delivery in 2-4 business days</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Gift className="h-4 w-4" />
                        <span>Cash on Delivery available</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}