"use client";

import { Star, StarHalf } from "lucide-react";

interface ReviewsStatsProps {
    averageRating: number;
    totalReviews: number;
    ratingCounts: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export function ReviewsStats({ averageRating, totalReviews, ratingCounts }: ReviewsStatsProps) {
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />;
                    } else if (i === fullStars && hasHalfStar) {
                        return <StarHalf key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />;
                    } else {
                        return <Star key={i} className="h-5 w-5 text-muted-foreground" />;
                    }
                })}
            </div>
        );
    };

    const getPercentage = (count: number) => {
        if (totalReviews === 0) return 0;
        return (count / totalReviews) * 100;
    };

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Review Summary</h3>
            
            {/* Overall Rating */}
            <div className="text-center py-4 border-b">
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="mt-2">{renderStars(averageRating)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                    Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                        <div className="w-12 text-sm">{star} star</div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${getPercentage(ratingCounts[star as keyof typeof ratingCounts])}%` }}
                            />
                        </div>
                        <div className="w-12 text-sm text-muted-foreground">
                            {ratingCounts[star as keyof typeof ratingCounts]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}