"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { bulkUpdateReviewStatus } from "@/actions/review.action";
import { toast } from "sonner";

interface Review {
    id: string;
    medicine: {
        name: string;
    };
}

interface BulkRejectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reviewIds: string[];
    reviews: Review[];
    onSuccess: () => void;
}

export function BulkRejectDialog({ open, onOpenChange, reviewIds, reviews, onSuccess }: BulkRejectDialogProps) {
    const router = useRouter();
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(`Rejecting ${reviewIds.length} reviews...`);

        try {
            const result = await bulkUpdateReviewStatus(reviewIds, "REJECTED", rejectionReason);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success(`${result.data?.updatedCount || reviewIds.length} reviews rejected successfully`, { id: toastId });
                onSuccess();
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to reject reviews", { id: toastId });
        } finally {
            setIsSubmitting(false);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Bulk Reject Reviews
                    </DialogTitle>
                    <DialogDescription>
                        You are about to reject {reviewIds.length} review{reviewIds.length !== 1 ? "s" : ""}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Reviews Preview */}
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                        {reviews.map((review) => (
                            <div key={review.id} className="text-sm py-1 border-b last:border-0">
                                {review.medicine.name}
                            </div>
                        ))}
                    </div>

                    {/* Rejection Reason */}
                    <div>
                        <Label htmlFor="bulk-reason" className="text-sm mb-2 block">
                            Rejection Reason <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="bulk-reason"
                            placeholder="Explain why these reviews are being rejected..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!rejectionReason.trim() || isSubmitting}
                        variant="destructive"
                    >
                        {isSubmitting ? "Rejecting..." : `Reject ${reviewIds.length} Review${reviewIds.length !== 1 ? "s" : ""}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}