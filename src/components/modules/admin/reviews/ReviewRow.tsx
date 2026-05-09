"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Eye } from "lucide-react";
import { updateReviewStatus } from "@/actions/review.action";
import { toast } from "sonner";
import { ReviewDetailModal } from "./ReviewDetailModal";
import { SuspendReviewDialog } from "./SuspendReviewDialog";

interface Review {
    id: string;
    rating: number;
    comment: string;
    status: string;
    suspendReason?: string | null;
    createdAt: string;
    customer: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
    };
    medicine: {
        id: string;
        name: string;
        imageUrl: string | null;
        price: number;
    };
    seller: {
        id: string;
        storeName: string;
        ownerName: string;
        ownerEmail: string;
    };
    response?: {
        id: string;
        comment: string;
        createdAt: string;
    } | null;
}

interface ReviewRowProps {
    review: Review;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
    onStatusChange: (reviewId: string, newStatus: string) => void;
}

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

export function ReviewRow({ review, isSelected, onSelect, onStatusChange }: ReviewRowProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);

    const handleApprove = async () => {
        if (review.status === "APPROVED") return;
        
        setIsUpdating(true);
        const toastId = toast.loading("Approving review...");
        
        try {
            const result = await updateReviewStatus(review.id, "APPROVED");
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Review approved successfully", { id: toastId });
                onStatusChange(review.id, "APPROVED");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to approve review", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSuspend = async (suspendReason: string) => {
        setIsUpdating(true);
        const toastId = toast.loading("Suspending review...");
        
        try {
            const result = await updateReviewStatus(review.id, "SUSPENDED", suspendReason);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Review suspended successfully", { id: toastId });
                onStatusChange(review.id, "SUSPENDED");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to suspend review", { id: toastId });
        } finally {
            setIsUpdating(false);
            setShowSuspendDialog(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 inline-block ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
        ));
    };

    const getStatusBadge = () => {
        if (review.status === "APPROVED") {
            return <Badge className="bg-green-500 text-white">Approved</Badge>;
        }
        return <Badge variant="destructive">Suspended</Badge>;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <TableRow className="hover:bg-muted/50">
                <TableCell>
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onSelect}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            {isValidUrl(review.medicine.imageUrl) ? (
                                <Image
                                    src={review.medicine.imageUrl!}
                                    alt={review.medicine.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">💊</div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-sm line-clamp-1">{review.medicine.name}</p>
                            <p className="text-xs text-muted-foreground">${review.medicine.price}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                                {getInitials(review.customer.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm">{review.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{review.customer.email}</p>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm">{review.seller.storeName}</p>
                    <p className="text-xs text-muted-foreground">{review.seller.ownerName}</p>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-xs ml-1">({review.rating})</span>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="text-sm line-clamp-2 max-w-xs">{review.comment}</p>
                </TableCell>
                <TableCell>{getStatusBadge()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowDetailModal(true)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {review.status === "APPROVED" ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSuspendDialog(true)}
                                disabled={isUpdating}
                                className="text-destructive hover:text-destructive"
                            >
                                Suspend
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleApprove}
                                disabled={isUpdating}
                                className="text-green-600 hover:text-green-600"
                            >
                                Approve
                            </Button>
                        )}
                    </div>
                </TableCell>
            </TableRow>

            {/* Review Detail Modal */}
            <ReviewDetailModal
                open={showDetailModal}
                onOpenChange={setShowDetailModal}
                review={review}
                onApprove={handleApprove}
                onSuspend={() => setShowSuspendDialog(true)}
            />

            {/* Suspend Review Dialog */}
            <SuspendReviewDialog
                open={showSuspendDialog}
                onOpenChange={setShowSuspendDialog}
                review={review}
                onConfirm={handleSuspend}
                isSubmitting={isUpdating}
            />
        </>
    );
}