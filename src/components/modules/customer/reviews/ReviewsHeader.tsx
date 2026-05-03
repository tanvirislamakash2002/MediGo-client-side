"use client";

import { Star } from "lucide-react";

interface ReviewsHeaderProps {
    totalReviews: number;
}

export function ReviewsHeader({ totalReviews }: ReviewsHeaderProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Reviews</h1>
                    <p className="text-muted-foreground mt-1">
                        You have written {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>Help other customers by sharing your experience</span>
                </div>
            </div>
        </div>
    );
}