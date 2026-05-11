"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

interface OrderStatsProps {
    stats: {
        total: number;
        placed: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

export function OrderStats({ stats }: OrderStatsProps) {
    const statItems = [
        { label: "Total Orders", value: stats.total, icon: Package, color: "bg-gray-500" },
        { label: "Placed", value: stats.placed, icon: Clock, color: "bg-blue-500" },
        { label: "Processing", value: stats.processing, icon: Package, color: "bg-yellow-500" },
        { label: "Shipped", value: stats.shipped, icon: Truck, color: "bg-purple-500" },
        { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "bg-green-500" },
        { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "bg-red-500" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Card key={item.label}>
                        <CardContent className="p-4 text-center">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${item.color} text-white mb-2`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-2xl font-bold">{item.value}</p>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}