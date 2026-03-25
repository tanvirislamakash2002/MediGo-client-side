"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
    stats: {
        total: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Orders",
            value: stats.total,
            icon: Package,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-950/30",
        },
        {
            title: "Processing",
            value: stats.processing,
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-950/30",
        },
        {
            title: "Shipped",
            value: stats.shipped,
            icon: Truck,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Delivered",
            value: stats.delivered,
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}