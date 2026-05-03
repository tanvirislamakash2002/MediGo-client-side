"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {  updateReview } from "@/actions/review.action";

interface Review {
    id: string;
    medicineId: string;
    medicineName: string;
    rating: number;
    comment: string;
}

interface EditReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: Review;
    onUpdate: (reviewId: string, rating: number, comment: string) => void;
}

export function EditReviewDialog({ open, onOpenChange, review, onUpdate }: EditReviewDialogProps) {
    const router = useRouter();
    const [rating, setRating] = useState(review.rating);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(review.comment);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        
        if (!comment.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating your review...");

        try {
            // Note: You need to create an updateReview action for this
            // For now, we'll delete and create new (temporary solution)
            // Better to implement a proper updateReview endpoint
            const result = await updateReview(review.id, rating, comment);
            
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Review updated successfully!", { id: toastId });
                onUpdate(review.id, rating, comment);
                onOpenChange(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update review", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Review</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Editing review for: <span className="font-medium">{review.medicineName}</span>
                    </p>
                    
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
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}