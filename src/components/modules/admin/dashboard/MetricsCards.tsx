"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, Clock, Package, AlertTriangle } from "lucide-react";

interface MetricsCardsProps {
    stats: {
        totalUsers: { value: number; change: number };
        totalOrders: { value: number; change: number };
        totalRevenue: { value: number; change: number };
        pendingOrders: { value: number; change: number };
        lowStockItems: { value: number; change: number };
        totalProducts: { value: number; change: number };
    };
}

export function MetricsCards({ stats }: MetricsCardsProps) {
    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers.value,
            change: stats.totalUsers.change,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.value,
            change: stats.totalOrders.change,
            icon: ShoppingCart,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.value.toLocaleString()}`,
            change: stats.totalRevenue.change,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders.value,
            change: stats.pendingOrders.change,
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-950/30",
        },
        {
            title: "Low Stock Items",
            value: stats.lowStockItems.value,
            change: stats.lowStockItems.change,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Total Products",
            value: stats.totalProducts.value,
            change: stats.totalProducts.change,
            icon: Package,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => (
                <Card key={card.title} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{card.value}</span>
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </div>
                        <div className={`mt-2 text-xs ${card.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {card.change >= 0 ? "↑" : "↓"} {Math.abs(card.change)}% from last period
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}