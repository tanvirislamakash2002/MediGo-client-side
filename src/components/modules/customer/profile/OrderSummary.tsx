"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface OrderSummaryProps {
    orders: Order[];
}

export function OrderSummary({ orders }: OrderSummaryProps) {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const recentOrders = orders.slice(0, 3);
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "text-green-600";
            case "PROCESSING": return "text-blue-600";
            case "SHIPPED": return "text-purple-600";
            case "CANCELLED": return "text-red-600";
            default: return "text-yellow-600";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Summary</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/customer/orders">View All →</Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Total Orders</p>
                            <p className="font-semibold text-lg">{totalOrders}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Total Spent</p>
                            <p className="font-semibold text-lg">${totalSpent.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {recentOrders.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Recent Orders</p>
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-2 border rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">#{order.id.slice(-6)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                                    <p className={`text-xs ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalOrders === 0 && (
                    <div className="text-center py-6">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No orders yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Start shopping to see your orders here
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                            <Link href="/shop">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}