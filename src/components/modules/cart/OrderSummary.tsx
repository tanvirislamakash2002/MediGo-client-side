"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Shield, Truck, Clock, Gift } from "lucide-react";
import { toast } from "sonner";

interface OrderSummaryProps {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    freeShippingThreshold: number;
}

export function OrderSummary({ 
    subtotal, 
    shippingCost, 
    tax, 
    total, 
    freeShippingThreshold 
}: OrderSummaryProps) {
    const router = useRouter();
    const [promoCode, setPromoCode] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [discount, setDiscount] = useState(0);

    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        
        setIsApplyingPromo(true);
        // Simulate promo code validation
        setTimeout(() => {
            if (promoCode.toUpperCase() === "WELCOME10") {
                setDiscount(subtotal * 0.1);
                toast.success("Promo code applied! 10% discount");
            } else {
                toast.error("Invalid promo code");
            }
            setIsApplyingPromo(false);
        }, 500);
    };

    const handleCheckout = () => {
        router.push("/checkout");
    };

    const finalTotal = total - discount;

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Free Shipping Progress */}
                {remainingForFreeShipping > 0 && (
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

                {/* Totals */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        {shippingCost === 0 ? (
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

                {/* Checkout Button */}
                <Button 
                    onClick={handleCheckout} 
                    className="w-full"
                    size="lg"
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