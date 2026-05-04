"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReviewCard } from "./ReviewCard";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { getSellerReviews } from "@/actions/review.action";
import { ReviewsSkeleton } from "./ReviewsSkeleton";

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

interface ReviewsListProps {
    initialReviews: Review[];
    initialPage: number;
    initialSort: string;
    initialRating?: string;
    initialProductId?: string;
    initialDateRange: string;
    initialResponded?: string;
    initialSearch?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    totalReviews: number;
}

export function ReviewsList({ 
    initialReviews, 
    initialPage, 
    initialSort,
    initialRating,
    initialProductId,
    initialDateRange,
    initialResponded,
    initialSearch,
    pagination: initialPagination,
    totalReviews
}: ReviewsListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            const rating = searchParams.get("rating") || initialRating;
            const productId = searchParams.get("productId") || initialProductId;
            const dateRange = searchParams.get("dateRange") || initialDateRange;
            const responded = searchParams.get("responded") || initialResponded;
            const search = searchParams.get("search") || initialSearch;
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            
            const result = await getSellerReviews({ 
                rating, productId, dateRange, responded, search, sort, page, limit: 10 
            });
            
            if (result.success) {
                setReviews(result.data?.reviews || []);
                setPagination(result.data?.pagination);
            }
            setIsLoading(false);
        };

        fetchReviews();
    }, [searchParams, initialRating, initialProductId, initialDateRange, initialResponded, initialSearch, initialSort]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/seller/reviews?${params.toString()}`);
    };

    const handleResponseAdded = (reviewId: string, responseText: string) => {
        setReviews(reviews.map(review => 
            review.id === reviewId 
                ? { 
                    ...review, 
                    response: {
                        id: `temp-${Date.now()}`,
                        comment: responseText,
                        createdAt: new Date().toISOString()
                    }
                }
                : review
        ));
    };

    if (isLoading && reviews.length === 0) {
        return <ReviewsSkeleton />;
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <div className="flex justify-center mb-4">
                    <MessageSquare className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground mb-4">
                    {searchParams.get("search") || searchParams.get("rating") || searchParams.get("productId")
                        ? "No reviews match your filters"
                        : "You haven't received any customer reviews yet"}
                </p>
                {!searchParams.get("search") && !searchParams.get("rating") && !searchParams.get("productId") && (
                    <Button onClick={() => router.push("/seller/medicines")}>
                        View Your Products
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    Showing {reviews.length} of {totalReviews} reviews
                </p>
            </div>
            
            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onResponseAdded={handleResponseAdded}
                    />
                ))}
            </div>
            
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}