"use client";

import { useState } from "react";
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

interface Review {
    id: string;
    rating: number;
    comment: string;
    medicine: {
        name: string;
    };
    customer: {
        name: string;
    };
}

interface RejectReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: Review;
    onConfirm: (reason: string) => void;
    isSubmitting: boolean;
}

const predefinedReasons = [
    "Contains offensive or inappropriate language",
    "Spam or promotional content",
    "Not relevant to the product",
    "Fake or misleading review",
    "Personal information exposed",
    "Violates community guidelines",
];

export function RejectReviewDialog({ open, onOpenChange, review, onConfirm, isSubmitting }: RejectReviewDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedReason, setSelectedReason] = useState("");

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        setRejectionReason(reason);
    };

    const handleConfirm = () => {
        if (!rejectionReason.trim()) {
            return;
        }
        onConfirm(rejectionReason);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Reject Review
                    </DialogTitle>
                    <DialogDescription>
                        Review from <strong>{review.customer.name}</strong> for <strong>{review.medicine.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Review Preview */}
                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Review:</p>
                        <p className="text-sm text-muted-foreground">&ldquo;{review.comment}&rdquo;</p>
                    </div>

                    {/* Predefined Reasons */}
                    <div>
                        <Label className="text-sm mb-2 block">Common Reasons</Label>
                        <div className="space-y-2">
                            {predefinedReasons.map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    onClick={() => handleReasonSelect(reason)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md border transition-colors ${
                                        selectedReason === reason
                                            ? "border-destructive bg-destructive/5 text-destructive"
                                            : "border-border hover:border-destructive/50"
                                    }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Reason */}
                    <div>
                        <Label htmlFor="reason" className="text-sm mb-2 block">
                            Custom Reason <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Explain why this review is being rejected..."
                            value={rejectionReason}
                            onChange={(e) => {
                                setRejectionReason(e.target.value);
                                setSelectedReason("");
                            }}
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
                        {isSubmitting ? "Rejecting..." : "Reject Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}