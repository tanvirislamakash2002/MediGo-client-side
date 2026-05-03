"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
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

interface ReviewSectionProps {
    order: Order;
}

export function ReviewSection({ order }: ReviewSectionProps) {
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

    const unsubmittedItems = order.items.filter(item => !submittedItems.has(item.id));

    if (unsubmittedItems.length === 0) {
        return (
            <Card className="p-4">
                <h3 className="font-semibold mb-4">Reviews</h3>
                <p className="text-muted-foreground text-center py-4">
                    You have reviewed all items in this order.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            
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
                        {unsubmittedItems.map((item) => (
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
            </div>
        </Card>
    );
}