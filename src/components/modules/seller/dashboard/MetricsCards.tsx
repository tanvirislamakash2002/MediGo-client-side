"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp, Star } from "lucide-react";

interface MetricsCardsProps {
    stats: {
        totalSales: { value: number; change: number };
        totalOrders: { value: number; change: number };
        totalProducts: { value: number; change: number };
        lowStockItems: { value: number; change: number };
        averageOrderValue: { value: number; change: number };
        averageRating: { value: number; change: number };
    };
}

export function MetricsCards({ stats }: MetricsCardsProps) {
    const cards = [
        {
            title: "Total Sales",
            value: `$${stats.totalSales.value.toLocaleString()}`,
            change: stats.totalSales.change,
            icon: DollarSign,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.value,
            change: stats.totalOrders.change,
            icon: ShoppingCart,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Total Products",
            value: stats.totalProducts.value,
            change: stats.totalProducts.change,
            icon: Package,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-950/30",
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
            title: "Avg Order Value",
            value: `$${stats.averageOrderValue.value.toFixed(2)}`,
            change: stats.averageOrderValue.change,
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-950/30",
        },
        {
            title: "Avg Rating",
            value: `${stats.averageRating.value.toFixed(1)} ⭐`,
            change: stats.averageRating.change,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-950/30",
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