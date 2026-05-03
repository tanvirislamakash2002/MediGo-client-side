"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { createReview } from "@/actions/review.action";

interface ReviewFormProps {
    medicineId: string;
    onSuccess: (review: any) => void;
    onCancel: () => void;
    setIsSubmitting: (value: boolean) => void;
}

export function ReviewForm({ medicineId, onSuccess, onCancel, setIsSubmitting }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        
        if (!comment.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsLoading(true);
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting review...");

        try {
            const result = await createReview(medicineId, rating, comment);
            
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Review submitted successfully!", { id: toastId });
                onSuccess(result.data);
            }
        } catch (error) {
            toast.error("Failed to submit review", { id: toastId });
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
                <CardTitle className="text-lg">Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none"
                            >
                                <Star 
                                    className={`h-6 w-6 ${
                                        star <= (hoverRating || rating) 
                                            ? "fill-yellow-400 text-yellow-400" 
                                            : "text-muted-foreground"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="text-sm font-medium mb-2 block">Your Review</label>
                    <Textarea
                        placeholder="Share your experience with this medicine..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
                
                <div className="flex gap-3">
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Import missing Card components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";