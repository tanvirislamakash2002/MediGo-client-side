"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { getAllReviewsForAdmin } from "@/actions/review.action";
import { ReviewRow } from "./ReviewRow";
import { BulkSuspendDialog } from "./BulkSuspendDialog";
import { ReviewsSkeleton } from "./ReviewsSkeleton";

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
        image: string | null;
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

interface ReviewsTableProps {
    initialReviews: Review[];
    initialPage: number;
    initialStatus?: string;
    initialRating?: string;
    initialDateRange?: string;
    initialSellerId?: string;
    initialSearch?: string;
    initialSort: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    stats?: any;
}

export function ReviewsTable({
    initialReviews,
    initialPage,
    initialStatus,
    initialRating,
    initialDateRange,
    initialSellerId,
    initialSearch,
    initialSort,
    pagination: initialPagination,
}: ReviewsTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
    const [showBulkSuspendDialog, setShowBulkSuspendDialog] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            const status = searchParams.get("status") || initialStatus;
            const rating = searchParams.get("rating") || initialRating;
            const dateRange = searchParams.get("dateRange") || initialDateRange;
            const sellerId = searchParams.get("sellerId") || initialSellerId;
            const search = searchParams.get("search") || initialSearch;
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            
            const result = await getAllReviewsForAdmin({
                status, rating, dateRange, sellerId, search, sort, page, limit: 20
            });
            
            if (result.success) {
                setReviews(result.data?.reviews || []);
                setPagination(result.data?.pagination);
            }
            setIsLoading(false);
        };

        fetchReviews();
    }, [
        searchParams,
        initialStatus,
        initialRating,
        initialDateRange,
        initialSellerId,
        initialSearch,
        initialSort,
    ]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/admin/reviews?${params.toString()}`);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedReviews(new Set(reviews.map(r => r.id)));
        } else {
            setSelectedReviews(new Set());
        }
    };

    const handleSelectReview = (reviewId: string, checked: boolean) => {
        const newSelected = new Set(selectedReviews);
        if (checked) {
            newSelected.add(reviewId);
        } else {
            newSelected.delete(reviewId);
        }
        setSelectedReviews(newSelected);
    };

    const handleStatusChange = (reviewId: string, newStatus: string) => {
        setReviews(reviews.map(review => 
            review.id === reviewId ? { ...review, status: newStatus } : review
        ));
        // Remove from selected if it was selected
        if (selectedReviews.has(reviewId)) {
            const newSelected = new Set(selectedReviews);
            newSelected.delete(reviewId);
            setSelectedReviews(newSelected);
        }
    };

    const handleBulkSuspend = () => {
        setShowBulkSuspendDialog(true);
    };

    const clearSelection = () => {
        setSelectedReviews(new Set());
    };

    if (isLoading && reviews.length === 0) {
        return <ReviewsSkeleton />;
    }

    if (reviews.length === 0) {
        return (
            <div className="border rounded-lg text-center py-12">
                <p className="text-muted-foreground">No reviews found</p>
            </div>
        );
    }

    const selectedCount = selectedReviews.size;

    return (
        <>
            {/* Bulk Actions Bar */}
            {selectedCount > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {selectedCount} review{selectedCount !== 1 ? "s" : ""} selected
                        </span>
                        <Button variant="ghost" size="sm" onClick={clearSelection}>
                            Clear
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkSuspend}
                        >
                            Suspend Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Reviews Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedReviews.size === reviews.length && reviews.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Seller</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-28">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <ReviewRow
                                key={review.id}
                                review={review}
                                isSelected={selectedReviews.has(review.id)}
                                onSelect={(checked) => handleSelectReview(review.id, checked)}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {reviews.length} of {pagination.total} reviews
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Bulk Suspend Dialog */}
            <BulkSuspendDialog
                open={showBulkSuspendDialog}
                onOpenChange={setShowBulkSuspendDialog}
                reviewIds={Array.from(selectedReviews)}
                reviews={reviews.filter(r => selectedReviews.has(r.id))}
                onSuccess={() => {
                    setSelectedReviews(new Set());
                    router.refresh();
                }}
            />
        </>
    );
}