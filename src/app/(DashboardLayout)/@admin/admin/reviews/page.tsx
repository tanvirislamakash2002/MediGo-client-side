import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getAllReviewsForAdmin, getAdminReviewStats } from "@/actions/review.action";
import { ReviewsHeader } from "@/components/modules/admin/reviews/ReviewsHeader";
import { ReviewsStats } from "@/components/modules/admin/reviews/ReviewsStats";
import { ReviewsFilters } from "@/components/modules/admin/reviews/ReviewsFilters";
import { ReviewsTable } from "@/components/modules/admin/reviews/ReviewsTable";
import { RatingDistribution } from "@/components/modules/admin/reviews/RatingDistribution";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        rating?: string;
        dateRange?: string;
        sellerId?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();
    
    if (!success || !session || session.user.role !== "ADMIN") {
        redirect("/login?redirect=/admin/reviews");
    }
    
    const params = await searchParams;
    const status = params.status;
    const rating = params.rating;
    const dateRange = params.dateRange;
    const sellerId = params.sellerId;
    const search = params.search;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;
    
    const [reviewsResult, statsResult] = await Promise.all([
        getAllReviewsForAdmin({ status, rating, dateRange, sellerId, search, sort, page, limit: 20 }),
        getAdminReviewStats()
    ]);
    
    const reviews = reviewsResult.success ? reviewsResult.data?.reviews || [] : [];
    const stats = statsResult.success ? statsResult.data : null;
    const pagination = reviewsResult.success ? reviewsResult.data?.pagination : null;
    
    return (
        <div className="space-y-6">
            <ReviewsHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Stats & Distribution */}
                <div className="lg:col-span-1 space-y-6">
                    <ReviewsStats stats={stats} />
                    <RatingDistribution stats={stats} />
                </div>
                
                {/* Right Column - Reviews Table */}
                <div className="lg:col-span-3">
                    <ReviewsFilters 
                        initialStatus={status}
                        initialRating={rating}
                        initialDateRange={dateRange}
                        initialSellerId={sellerId}
                        initialSearch={search}
                        initialSort={sort}
                    />
                    
                    <ReviewsTable 
                        initialReviews={reviews}
                        initialPage={page}
                        initialStatus={status}
                        initialRating={rating}
                        initialDateRange={dateRange}
                        initialSellerId={sellerId}
                        initialSearch={search}
                        initialSort={sort}
                        pagination={pagination}
                        stats={stats}
                    />
                </div>
            </div>
        </div>
    );
}