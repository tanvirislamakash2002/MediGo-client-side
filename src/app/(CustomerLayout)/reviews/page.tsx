import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getMyReviews } from "@/actions/review.action";
import { ReviewsHeader } from "@/components/modules/customer/reviews/ReviewsHeader";
import { ReviewsStats } from "@/components/modules/customer/reviews/ReviewsStats";
import { ReviewsFilters } from "@/components/modules/customer/reviews/ReviewsFilters";
import { ReviewsSkeleton } from "@/components/modules/customer/reviews/ReviewsSkeleton";
import { ReviewsList } from "@/components/modules/customer/reviews/ReviewsList";

interface PageProps {
    searchParams: Promise<{
        sort?: string;
        rating?: string;
        search?: string;
        page?: string;
    }>;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    medicineId: string;
    medicineName: string;
    medicineImage?: string | null;
}

export default async function CustomerReviewsPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();
    
    if (!success || !session) {
        redirect("/login?redirect=/customer/reviews");
    }
    
    const params = await searchParams;
    const sort = params.sort || "newest";
    const ratingFilter = params.rating;
    const search = params.search;
    const page = params.page ? parseInt(params.page) : 1;
    
    const result = await getMyReviews(page, 10);
    const reviews: Review[] = result.success ? result.data?.reviews || [] : [];
    const pagination = result.success ? result.data?.pagination : null;
    
    // Calculate stats
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;
    
    const ratingCounts = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <ReviewsHeader totalReviews={totalReviews} />
                    
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Stats & Filters */}
                        <div className="lg:col-span-1 space-y-6">
                            <ReviewsStats 
                                averageRating={averageRating}
                                totalReviews={totalReviews}
                                ratingCounts={ratingCounts}
                            />
                            <ReviewsFilters 
                                initialSort={sort}
                                initialRating={ratingFilter}
                                initialSearch={search}
                            />
                        </div>
                        
                        {/* Right Column - Reviews List */}
                        <div className="lg:col-span-2">
                            <Suspense fallback={<ReviewsSkeleton />}>
                                <ReviewsList 
                                    initialReviews={reviews}
                                    initialPage={page}
                                    initialSort={sort}
                                    initialRating={ratingFilter}
                                    initialSearch={search}
                                    pagination={pagination}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}