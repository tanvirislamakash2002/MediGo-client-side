"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ReviewStats {
    ratingCounts: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    totalReviews: number;
}

interface RatingDistributionProps {
    stats: ReviewStats | null;
}

export function RatingDistribution({ stats }: RatingDistributionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRating = searchParams.get("rating");

    if (!stats || stats.totalReviews === 0) {
        return (
            <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Rating Distribution</h3>
                <p className="text-sm text-muted-foreground text-center py-4">
                    No reviews yet
                </p>
            </div>
        );
    }

    const ratings = [5, 4, 3, 2, 1];
    const getPercentage = (count: number) => {
        return (count / stats.totalReviews) * 100;
    };

    const handleRatingClick = (rating: number) => {
        const params = new URLSearchParams(searchParams);
        if (currentRating === rating.toString()) {
            params.delete("rating");
        } else {
            params.set("rating", rating.toString());
        }
        params.delete("page");
        router.push(`/seller/reviews?${params.toString()}`);
    };

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Rating Distribution</h3>
            <div className="space-y-2">
                {ratings.map((rating) => {
                    const count = stats.ratingCounts[rating as keyof typeof stats.ratingCounts] || 0;
                    const percentage = getPercentage(count);
                    const isActive = currentRating === rating.toString();
                    
                    return (
                        <button
                            key={rating}
                            onClick={() => handleRatingClick(rating)}
                            className={`w-full text-left group cursor-pointer transition-colors ${
                                isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                            }`}
                        >
                            <div className="flex items-center gap-2 text-sm mb-1">
                                <span className="w-8">{rating} ★</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-yellow-400 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-10 text-right text-muted-foreground">
                                    {count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 pt-2 border-t text-xs text-muted-foreground text-center">
                Based on {stats.totalReviews} reviews
            </div>
        </div>
    );
}