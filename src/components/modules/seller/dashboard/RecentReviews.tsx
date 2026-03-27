"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Review {
    id: string;
    productName: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface RecentReviewsProps {
    reviews: Review[];
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
};

export function RecentReviews({ reviews }: RecentReviewsProps) {
    if (reviews.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No reviews yet. Keep selling to get customer feedback!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Reviews</CardTitle>
                <Button variant="ghost" size="sm">
                    View All →
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium">{review.productName}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">— {review.customerName}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}