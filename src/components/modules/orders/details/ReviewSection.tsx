"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf } from "lucide-react";
import { toast } from "sonner";

interface Order {
    id: string;
    items: Array<{
        id: string;
        name: string;
    }>;
}

interface ReviewSectionProps {
    order: Order;
}

export function ReviewSection({ order }: ReviewSectionProps) {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = async () => {
        if (!selectedItem) {
            toast.error("Please select an item to review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        
        setIsSubmitting(true);
        // Submit review logic here
        setTimeout(() => {
            toast.success("Review submitted successfully");
            setSelectedItem(null);
            setRating(0);
            setReview("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Select Medicine</label>
                    <select
                        value={selectedItem || ""}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                        <option value="">Select a medicine to review</option>
                        {order.items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                
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
                                {star <= (hoverRating || rating) ? (
                                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                ) : (
                                    <Star className="h-6 w-6 text-muted-foreground" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="text-sm font-medium mb-2 block">Your Review</label>
                    <Textarea
                        placeholder="Share your experience with this medicine..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={4}
                    />
                </div>
                
                <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
            </div>
        </Card>
    );
}