"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { customerProfile } from "@/actions/profile";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Review {
    id: string;
    medicineId: string;
    medicineName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface RecentReviewsProps {
    reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const recentReviews = reviews.slice(0, 2);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const toastId = toast.loading("Deleting review...");

        try {
            const result = await customerProfile.deleteCustomerReview(deleteId);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Review deleted", { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete review", { id: toastId });
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
            />
        ));
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Reviews</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <a href="/customer/reviews">View All →</a>
                    </Button>
                </CardHeader>
                <CardContent>
                    {reviews.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                <span>{reviews.length} reviews written</span>
                            </div>
                            {recentReviews.map((review) => (
                                <div key={review.id} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-sm">{review.medicineName}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteId(review.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                            {reviews.length > 2 && (
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                    +{reviews.length - 2} more reviews
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No reviews yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Your reviews will appear here
                            </p>
                            <Button variant="outline" size="sm" className="mt-3" asChild>
                                <a href="/shop">Shop Now</a>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Review"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}