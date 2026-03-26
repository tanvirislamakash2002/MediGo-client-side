"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Truck } from "lucide-react";

interface Order {
    totalAmount: number;
    status: string;
}

interface OrderSummaryProps {
    order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
    if (!order) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    const subtotal = order.totalAmount || 0;
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    return (
        <Card className="sticky top-24">
            <CardHeader className="border-b">
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                    ) : (
                        <span>${shippingCost.toFixed(2)}</span>
                    )}
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span>Payment Method: Cash on Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        <span>Free delivery on orders over $50</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}