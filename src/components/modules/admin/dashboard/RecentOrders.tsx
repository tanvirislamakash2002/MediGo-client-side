"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface Order {
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface RecentOrdersProps {
    orders: Order[];
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

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/orders">View All →</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 font-medium">Order ID</th>
                                <th className="text-left py-2 font-medium">Customer</th>
                                <th className="text-left py-2 font-medium">Amount</th>
                                <th className="text-left py-2 font-medium">Status</th>
                                <th className="text-left py-2 font-medium">Date</th>
                                <th className="text-left py-2 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b last:border-0">
                                    <td className="py-2 font-mono">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </td>
                                    <td className="py-2">{order.customerName}</td>
                                    <td className="py-2">${order.totalAmount.toFixed(2)}</td>
                                    <td className="py-2">{getStatusBadge(order.status)}</td>
                                    <td className="py-2 text-muted-foreground">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="py-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}