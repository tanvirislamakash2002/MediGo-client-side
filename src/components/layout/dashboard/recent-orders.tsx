"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface Order {
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

interface RecentOrdersProps {
    orders: Order[];
    role: "seller" | "admin";
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PLACED":
            return <Badge variant="default">Placed</Badge>;
        case "PROCESSING":
            return <Badge variant="secondary">Processing</Badge>;
        case "SHIPPED":
            return <Badge variant="secondary">Shipped</Badge>;
        case "DELIVERED":
            return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
        case "CANCELLED":
            return <Badge variant="destructive">Cancelled</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export function RecentOrders({ orders, role }: RecentOrdersProps) {
    const basePath = role === "seller" ? "/seller/orders" : "/admin/orders";
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`${basePath}`}>View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No orders yet
                        </p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.customerName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm font-semibold">
                                        ${order.total.toFixed(2)}
                                    </p>
                                    <div>{getStatusBadge(order.status)}</div>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`${basePath}/${order.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}