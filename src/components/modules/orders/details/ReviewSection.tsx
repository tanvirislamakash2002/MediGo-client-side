"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createReview } from "@/actions/review.action";

interface Order {
    id: string;
    items: Array<{
        id: string;
        name: string;
        medicineId: string;
    }>;
}

interface ExistingReview {
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewSectionProps {
    order: Order;
    existingReviews?: Record<string, ExistingReview>;
}

export function ReviewSection({ order, existingReviews = {} }: ReviewSectionProps) {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedItems, setSubmittedItems] = useState<Set<string>>(new Set());

    const handleItemSelect = (itemId: string, medicineId: string, itemName: string) => {
        setSelectedItem(itemId);
        setSelectedMedicineId(medicineId);
        // Reset form
        setRating(0);
        setReview("");
    };

    const handleSubmitReview = async () => {
        if (!selectedMedicineId) {
            toast.error("Please select an item to review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting your review...");

        try {
            const result = await createReview(selectedMedicineId, rating, review);
            
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Review submitted successfully!", { id: toastId });
                setSubmittedItems(prev => new Set(prev).add(selectedItem!));
                setSelectedItem(null);
                setSelectedMedicineId(null);
                setRating(0);
                setReview("");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to submit review", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine which items need review
    const itemsWithReviews = order.items.filter(item => existingReviews[item.medicineId]);
    const itemsWithoutReviews = order.items.filter(item => !existingReviews[item.medicineId] && !submittedItems.has(item.id));
    const allReviewed = itemsWithoutReviews.length === 0;

    if (allReviewed && itemsWithReviews.length > 0) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Your Reviews</h3>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/reviews">
                            View All Reviews
                            <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                    </Button>
                </div>
                <div className="space-y-3">
                    {itemsWithReviews.map((item) => (
                        <div key={item.id} className="border-b pb-3 last:border-0">
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-3 w-3 ${
                                                star <= existingReviews[item.medicineId].rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(existingReviews[item.medicineId].createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {existingReviews[item.medicineId].comment}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (itemsWithoutReviews.length === 0 && itemsWithReviews.length === 0) {
        return (
            <Card className="p-4">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <p className="text-muted-foreground text-center py-4">
                    No items to review in this order.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Write a Review</h3>
                {itemsWithReviews.length > 0 && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/customer/reviews">
                            View My Reviews
                            <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                    </Button>
                )}
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Select Medicine</label>
                    <select
                        value={selectedItem || ""}
                        onChange={(e) => {
                            const item = order.items.find(i => i.id === e.target.value);
                            if (item) {
                                handleItemSelect(item.id, item.medicineId, item.name);
                            }
                        }}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                        <option value="">Select a medicine to review</option>
                        {itemsWithoutReviews.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {selectedItem && (
                    <>
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
                    </>
                )}

                {/* Show already reviewed items */}
                {itemsWithReviews.length > 0 && !selectedItem && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Already reviewed:</p>
                        <div className="space-y-2">
                            {itemsWithReviews.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 text-sm">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}