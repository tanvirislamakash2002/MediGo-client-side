import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getSellerReviews, getSellerReviewStats } from "@/actions/review.action";
import { ReviewsHeader } from "@/components/modules/seller/reviews/ReviewsHeader";
import { ReviewsStats } from "@/components/modules/seller/reviews/ReviewsStats";
import { RatingDistribution } from "@/components/modules/seller/reviews/RatingDistribution";
import { ReviewsFilters } from "@/components/modules/seller/reviews/ReviewsFilters";
import { ReviewsList } from "@/components/modules/seller/reviews/ReviewsList";

interface PageProps {
    searchParams: Promise<{
        rating?: string;
        productId?: string;
        dateRange?: string;
        responded?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function SellerReviewsPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();
    
    if (!success || !session || session.user.role !== "SELLER") {
        redirect("/login?redirect=/seller/reviews");
    }
    
    const params = await searchParams;
    const rating = params.rating;
    const productId = params.productId;
    const dateRange = params.dateRange || "30";
    const responded = params.responded;
    const search = params.search;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;
    
    const [reviewsResult, statsResult] = await Promise.all([
        getSellerReviews({ rating, productId, dateRange, responded, search, sort, page, limit: 10 }),
        getSellerReviewStats()
    ]);
    
    const reviews = reviewsResult.success ? reviewsResult.data?.reviews || [] : [];
    const stats = statsResult.success ? statsResult.data : null;
    const pagination = reviewsResult.success ? reviewsResult.data?.pagination : null;
    
    return (
        <div className="space-y-6">
            <ReviewsHeader />
            
            <ReviewsStats stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Rating Distribution & Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <RatingDistribution stats={stats} />
                    <ReviewsFilters 
                        initialRating={rating}
                        initialProductId={productId}
                        initialDateRange={dateRange}
                        initialResponded={responded}
                        initialSearch={search}
                        initialSort={sort}
                    />
                </div>
                
                {/* Right Column - Reviews List */}
                <div className="lg:col-span-3">
                    <ReviewsList 
                        initialReviews={reviews}
                        initialPage={page}
                        initialSort={sort}
                        initialRating={rating}
                        initialProductId={productId}
                        initialDateRange={dateRange}
                        initialResponded={responded}
                        initialSearch={search}
                        pagination={pagination}
                        totalReviews={stats?.total || 0}
                    />
                </div>
            </div>
        </div>
    );
}