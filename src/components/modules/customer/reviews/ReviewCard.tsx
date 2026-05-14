"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Edit, ExternalLink, Pill, MessageSquare, AlertCircle } from "lucide-react";
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
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    medicineId: string;
    medicineName: string;
    medicineImage?: string | null;
    rating: number;
    comment: string;
    createdAt: string;
    status?: string;
    suspendReason?: string | null;
    suspendedAt?: string | null;
    response?: {
        id: string;
        comment: string;
        createdAt: string;
    } | null;
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

    const isSuspended = review.status === "SUSPENDED";

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
            <Card className={`hover:shadow-md transition-shadow ${isSuspended ? "opacity-75 bg-muted/20" : ""}`}>
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
                                    <div className="flex items-center justify-center h-full text-2xl"><Pill size={45} /></div>
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
                                        {!isSuspended && (
                                            <Badge variant="outline" className="text-xs">
                                                Verified Purchase
                                            </Badge>
                                        )}
                                        {isSuspended && (
                                            <Badge variant="destructive" className="text-xs">
                                                Suspended
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                {!isSuspended && (
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
                                )}
                            </div>

                            {/* Suspended Review Message */}
                            {isSuspended && review.suspendReason && (
                                <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                                Review Suspended
                                            </p>
                                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                                {review.suspendReason}
                                            </p>
                                            {review.suspendedAt && (
                                                <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                                                    Suspended on {new Date(review.suspendedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Review Comment (only show if not suspended or if you want to show blurred) */}
                            {!isSuspended && (
                                <>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {review.comment}
                                    </p>

                                    {/* Seller Response */}
                                    {review.response && (
                                        <div className="mt-3 p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Seller Response
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(review.response.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-sm">
                                                {review.response.comment}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-muted-foreground">
                                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                                {!isSuspended && (
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/shop/${review.medicineId}`}>
                                            View Product
                                            <ExternalLink className="h-3 w-3 ml-1" />
                                        </Link>
                                    </Button>
                                )}
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
            {!isSuspended && (
                <EditReviewDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    review={review}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}