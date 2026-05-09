"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, Mail, Store, Package, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";

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

interface ReviewDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    review: Review;
    onApprove: () => void;
    onSuspend: () => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function ReviewDetailModal({ open, onOpenChange, review, onApprove, onSuspend }: ReviewDetailModalProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
        ));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status Banner */}
                    <div className={`p-3 rounded-lg ${review.status === "APPROVED" ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Current Status:</span>
                            <Badge className={review.status === "APPROVED" ? "bg-green-500" : "bg-red-500"}>
                                {review.status === "APPROVED" ? "Approved" : "Suspended"}
                            </Badge>
                        </div>
                        {review.suspendReason && (
                            <p className="text-sm text-muted-foreground mt-2">
                                <span className="font-medium">Suspendion Reason:</span> {review.suspendReason}
                            </p>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4" />
                            Product Information
                        </h4>
                        <div className="flex gap-3">
                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                                {review.medicine.imageUrl ? (
                                    <img src={review.medicine.imageUrl} alt={review.medicine.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">💊</div>
                                )}
                            </div>
                            <div>
                                <Link href={`/shop/${review.medicine.id}`} className="font-medium hover:underline">
                                    {review.medicine.name}
                                </Link>
                                <p className="text-sm text-muted-foreground">Price: ${review.medicine.price}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Info */}
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Mail className="h-4 w-4" />
                            Customer Information
                        </h4>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={review.customer.image || undefined} />
                                <AvatarFallback>{getInitials(review.customer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{review.customer.name}</p>
                                <p className="text-sm text-muted-foreground">{review.customer.email}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Seller Info */}
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Store className="h-4 w-4" />
                            Seller Information
                        </h4>
                        <div>
                            <p className="font-medium">{review.seller.storeName}</p>
                            <p className="text-sm text-muted-foreground">Owner: {review.seller.ownerName}</p>
                            <p className="text-sm text-muted-foreground">{review.seller.ownerEmail}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Review Content */}
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            Review Content
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm">({review.rating}/5)</span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Posted on {formatDate(review.createdAt)}
                        </div>
                    </div>

                    {/* Seller Response */}
                    {review.response && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Seller Response
                                </h4>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm">{review.response.comment}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Responded on {formatDate(review.response.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        {review.status === "APPROVED" ? (
                            <Button variant="destructive" className="flex-1" onClick={onSuspend}>
                                Suspend Review
                            </Button>
                        ) : (
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={onApprove}>
                                Approve Review
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}