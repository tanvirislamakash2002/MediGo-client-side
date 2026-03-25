"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

interface Stat {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    trend?: "up" | "down";
}

interface StatsCardsProps {
    stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                const isPositive = stat.change && stat.change > 0;
                
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            {stat.change !== undefined && (
                                <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"} flex items-center gap-1 mt-1`}>
                                    {isPositive ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(stat.change)}% from last month
                                </p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}