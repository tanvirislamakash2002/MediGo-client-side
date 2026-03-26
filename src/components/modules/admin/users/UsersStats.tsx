"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Store, Shield, CheckCircle, XCircle, Activity } from "lucide-react";

interface UsersStatsProps {
    stats: {
        total: number;
        customers: number;
        sellers: number;
        admins: number;
        active: number;
        banned: number;
        verified: number;
        unverified: number;
    };
}

export function UsersStats({ stats }: UsersStatsProps) {
    const cards = [
        {
            title: "Total Users",
            value: stats.total,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Customers",
            value: stats.customers,
            icon: User,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Sellers",
            value: stats.sellers,
            icon: Store,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-950/30",
        },
        {
            title: "Admins",
            value: stats.admins,
            icon: Shield,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Active",
            value: stats.active,
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-950/30",
        },
        {
            title: "Banned",
            value: stats.banned,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-950/30",
        },
        {
            title: "Verified",
            value: stats.verified,
            icon: CheckCircle,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
        },
        {
            title: "Unverified",
            value: stats.unverified,
            icon: XCircle,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-950/30",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            {cards.map((card) => (
                <Card key={card.title} className="overflow-hidden">
                    <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{card.value}</span>
                            <div className={`p-1.5 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-3 w-3 ${card.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}