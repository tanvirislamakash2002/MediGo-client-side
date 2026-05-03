"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, CheckCircle } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface ReviewsSectionProps {
    medicineId: string;
    initialReviews: Review[];
    averageRating: number;
    totalReviews: number;
    isAuthenticated: boolean;
    hasPurchased: boolean;
    userHasReviewed: boolean;
}

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
                if (i < fullStars) {
                    return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                } else if (i === fullStars && hasHalfStar) {
                    return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                } else {
                    return <Star key={i} className="h-4 w-4 text-muted-foreground" />;
                }
            })}
        </div>
    );
};

export function ReviewsSection({ 
    medicineId, 
    initialReviews, 
    averageRating, 
    totalReviews, 
    isAuthenticated,
    hasPurchased,
    userHasReviewed
}: ReviewsSectionProps) {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReviewSubmitted = (newReview: Review) => {
        setReviews([newReview, ...reviews]);
        setShowReviewForm(false);
        router.refresh();
    };

    const canWriteReview = isAuthenticated && hasPurchased && !userHasReviewed && !showReviewForm;

    return (
        <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            {renderStars(averageRating)}
                        </div>
                        <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                        </span>
                    </div>
                </div>
                
                {canWriteReview && (
                    <Button onClick={() => setShowReviewForm(true)}>
                        Write a Review
                    </Button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <ReviewForm 
                    medicineId={medicineId}
                    onSuccess={handleReviewSubmitted}
                    onCancel={() => setShowReviewForm(false)}
                    setIsSubmitting={setIsSubmitting}
                />
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={review.customer.image || undefined} />
                                        <AvatarFallback>
                                            {review.customer.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="font-medium">{review.customer.name}</p>
                                                <span className="flex items-center gap-2 mt-1">
                                                    {renderStars(review.rating)}
                                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified Purchase
                                                    </Badge>
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}