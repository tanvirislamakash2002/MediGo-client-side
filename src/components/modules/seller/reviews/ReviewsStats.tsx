"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    respondedCount: number;
    responseRate: number;
    averageResponseTime: number;
    lowRatingCount: number;
    ratingCounts: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

interface ReviewsStatsProps {
    stats: ReviewStats | null;
}

export function ReviewsStats({ stats }: ReviewsStatsProps) {
    if (!stats) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="h-12 w-12 bg-muted animate-pulse rounded-full mb-2" />
                            <div className="h-4 bg-muted animate-pulse rounded w-16 mb-1" />
                            <div className="h-6 bg-muted animate-pulse rounded w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const statsCards = [
        {
            title: "Average Rating",
            value: stats.averageRating.toFixed(1),
            icon: Star,
            iconColor: "text-yellow-500",
            suffix: "★",
        },
        {
            title: "Total Reviews",
            value: stats.totalReviews,
            icon: MessageSquare,
            iconColor: "text-blue-500",
            suffix: "",
        },
        {
            title: "Response Rate",
            value: `${stats.responseRate}%`,
            icon: CheckCircle,
            iconColor: "text-green-500",
            suffix: "",
        },
        {
            title: "Avg Response Time",
            value: `${stats.averageResponseTime}h`,
            icon: Clock,
            iconColor: "text-purple-500",
            suffix: "",
        },
        {
            title: "Low Rating Alerts",
            value: stats.lowRatingCount,
            icon: AlertTriangle,
            iconColor: "text-red-500",
            suffix: "",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Icon className={`h-5 w-5 ${card.iconColor}`} />
                                {card.suffix && (
                                    <span className="text-xs text-muted-foreground">{card.suffix}</span>
                                )}
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}