"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, CheckCircle, Clock, X, Send, Pill } from "lucide-react";
import { toast } from "sonner";
import { respondToReview } from "@/actions/review.action";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer: {
        id: string;
        name: string;
    };
    medicine: {
        id: string;
        name: string;
        imageUrl: string | null;
    };
    response?: {
        id: string;
        comment: string;
        createdAt: string;
    } | null;
}

interface ReviewCardProps {
    review: Review;
    onResponseAdded: (reviewId: string, response: string) => void;
}

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

export function ReviewCard({ review, onResponseAdded }: ReviewCardProps) {
    const router = useRouter();
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [responseText, setResponseText] = useState(review.response?.comment || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const hasResponse = !!review.response;
    const canRespond = !hasResponse || isEditing;

    const handleSubmitResponse = async () => {
        if (!responseText.trim()) {
            toast.error("Please enter a response");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Submitting response...");

        try {
            const result = await respondToReview(review.id, responseText);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Response submitted successfully", { id: toastId });
                onResponseAdded(review.id, responseText);
                setShowResponseForm(false);
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to submit response", { id: toastId });
        } finally {
            setIsSubmitting(false);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
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

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/seller/medicines/edit/${review.medicine.id}`} className="flex-shrink-0">
                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                            {isValidUrl(review.medicine.imageUrl) ? (
                                <Image
                                    src={review.medicine.imageUrl!}
                                    alt={review.medicine.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-2xl"><Pill size={45}/></div>
                            )}
                        </div>
                    </Link>

                    {/* Review Content */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <Link 
                                    href={`/seller/medicines/edit/${review.medicine.id}`}
                                    className="font-medium hover:text-primary transition-colors"
                                >
                                    {review.medicine.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.rating)}
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified Purchase
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(review.createdAt)}
                                    </p>
                                </div>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {getInitials(review.customer.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2">
                            {review.comment}
                        </p>

                        {/* Response Section */}
                        {hasResponse && !isEditing && !showResponseForm && (
                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-xs font-medium">Your Response</p>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(review.response!.createdAt)}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowResponseForm(true);
                                        }}
                                        className="h-6 px-2 text-xs ml-auto"
                                    >
                                        Edit
                                    </Button>
                                </div>
                                <p className="text-sm">{review.response!.comment}</p>
                            </div>
                        )}

                        {/* Response Form */}
                        {canRespond && showResponseForm && (
                            <div className="mt-3 space-y-2">
                                <Textarea
                                    placeholder="Write your response to this customer..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setShowResponseForm(false);
                                            setIsEditing(false);
                                            setResponseText(review.response?.comment || "");
                                        }}
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSubmitResponse}
                                        disabled={isSubmitting}
                                    >
                                        <Send className="h-3 w-3 mr-1" />
                                        {isSubmitting ? "Submitting..." : hasResponse ? "Update Response" : "Submit Response"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!showResponseForm && !hasResponse && (
                            <div className="flex gap-2 mt-3">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowResponseForm(true)}
                                >
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Respond to Review
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => router.push(`/seller/orders`)}
                                >
                                    View Order
                                </Button>
                            </div>
                        )}

                        {!showResponseForm && hasResponse && !isEditing && (
                            <div className="flex gap-2 mt-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => router.push(`/seller/orders`)}
                                >
                                    View Order
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}