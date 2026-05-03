"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Edit, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { deleteReview } from "@/actions/review.action";
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
import { EditReviewDialog } from "./EditReviewDialog";

interface Review {
    id: string;
    medicineId: string;
    medicineName: string;
    medicineImage?: string | null;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewCardProps {
    review: Review;
    onDelete: (reviewId: string) => void;
    onUpdate: (reviewId: string, rating: number, comment: string) => void;
}

const isValidUrl = (url: string | null | undefined) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

export function ReviewCard({ review, onDelete, onUpdate }: ReviewCardProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const toastId = toast.loading("Deleting review...");

        try {
            const result = await deleteReview(review.id);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Review deleted successfully", { id: toastId });
                onDelete(review.id);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete review", { id: toastId });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
        ));
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/shop/${review.medicineId}`} className="flex-shrink-0">
                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                                {isValidUrl(review.medicineImage) ? (
                                    <Image
                                        src={review.medicineImage!}
                                        alt={review.medicineName}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-2xl">💊</div>
                                )}
                            </div>
                        </Link>

                        {/* Review Content */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <Link 
                                        href={`/shop/${review.medicineId}`}
                                        className="font-medium hover:text-primary transition-colors"
                                    >
                                        {review.medicineName}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                        {renderStars(review.rating)}
                                        <Badge variant="outline" className="text-xs">
                                            Verified Purchase
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowEditDialog(true)}
                                        className="h-8 w-8"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-2">
                                {review.comment}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-muted-foreground">
                                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/shop/${review.medicineId}`}>
                                        View Product
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete your review for "{review.medicineName}"?
                            This action cannot be undone.
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

            {/* Edit Review Dialog */}
            <EditReviewDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                review={review}
                onUpdate={onUpdate}
            />
        </>
    );
}