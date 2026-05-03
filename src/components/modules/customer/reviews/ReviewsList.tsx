"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReviewCard } from "./ReviewCard";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Package, Star } from "lucide-react";
import { getMyReviews } from "@/actions/review.action";
import { ReviewsSkeleton } from "./ReviewsSkeleton";

interface Review {
    id: string;
    medicineId: string;
    medicineName: string;
    medicineImage?: string | null;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsListProps {
    initialReviews: Review[];
    initialPage: number;
    initialSort: string;
    initialRating?: string;
    initialSearch?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export function ReviewsList({
    initialReviews,
    initialPage,
    initialSort,
    initialRating,
    initialSearch,
    pagination: initialPagination
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
            const sort = searchParams.get("sort") || initialSort;
            const rating = searchParams.get("rating") || initialRating;
            const search = searchParams.get("search") || initialSearch;
            const page = parseInt(searchParams.get("page") || "1");

            const result = await getMyReviews(page, 10);
            if (result.success) {
                let filteredReviews = result.data?.reviews || [];

                // Apply rating filter
                if (rating && rating !== "all") {
                    filteredReviews = filteredReviews.filter(
                        (r: Review) => r.rating === parseInt(rating)
                    );
                }

                // Apply search filter
                if (search) {
                    filteredReviews = filteredReviews.filter(
                        (r: Review) => r.medicineName.toLowerCase().includes(search.toLowerCase())
                    );
                }

                // Apply sort
                switch (sort) {
                    case "oldest":
                        filteredReviews.sort((a: Review, b: Review) =>
                            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        );
                        break;
                    case "highest":
                        filteredReviews.sort((a: Review, b: Review) => b.rating - a.rating);
                        break;
                    case "lowest":
                        filteredReviews.sort((a: Review, b: Review) => a.rating - b.rating);
                        break;
                    default: // newest
                        filteredReviews.sort((a: Review, b: Review) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                }

                setReviews(filteredReviews);
                setPagination({
                    ...result.data?.pagination,
                    total: filteredReviews.length,
                    totalPages: Math.ceil(filteredReviews.length / 10)
                });
            }
            setIsLoading(false);
        };

        fetchReviews();
    }, [searchParams, initialSort, initialRating, initialSearch]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/customer/reviews?${params.toString()}`);
    };

    const handleDeleteReview = (reviewId: string) => {
        setReviews(reviews.filter(r => r.id !== reviewId));
    };

    const handleUpdateReview = (reviewId: string, rating: number, comment: string) => {
        setReviews(reviews.map(r =>
            r.id === reviewId ? { ...r, rating, comment } : r
        ));
    };

    if (isLoading && reviews.length === 0) {
        return <ReviewsSkeleton />;
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <div className="flex justify-center mb-4">
                    <Package className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground mb-4">
                    {searchParams.get("search") || searchParams.get("rating")
                        ? "No reviews match your filters"
                        : "You haven't written any reviews yet"}
                </p>
                {!searchParams.get("search") && !searchParams.get("rating") && (
                    <Button onClick={() => router.push("/orders")}>
                        View Your Orders
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onDelete={handleDeleteReview}
                        onUpdate={handleUpdateReview}
                    />
                ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center">
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
        </>
    );
}