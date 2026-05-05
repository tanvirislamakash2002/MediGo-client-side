"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, CheckCircle, XCircle } from "lucide-react";

interface ReviewStats {
    totalReviews: number;
    approvedCount: number;
    rejectedCount: number;
    averageRating: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

interface ReviewsStatsProps {
    stats: ReviewStats | null;
}

export function ReviewsStats({ stats }: ReviewsStatsProps) {
    if (!stats) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="h-10 w-10 bg-muted animate-pulse rounded-full mb-2" />
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
            title: "Total Reviews",
            value: stats.totalReviews,
            icon: MessageSquare,
            iconColor: "text-blue-500",
        },
        {
            title: "Approved",
            value: stats.approvedCount,
            icon: CheckCircle,
            iconColor: "text-green-500",
        },
        {
            title: "Rejected",
            value: stats.rejectedCount,
            icon: XCircle,
            iconColor: "text-red-500",
        },
        {
            title: "Avg Rating",
            value: stats.averageRating.toFixed(1),
            icon: Star,
            iconColor: "text-yellow-500",
            suffix: "★",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
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