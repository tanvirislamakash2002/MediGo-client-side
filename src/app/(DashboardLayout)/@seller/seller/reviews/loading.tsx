import { ReviewsSkeleton } from "@/components/modules/seller/reviews/ReviewsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SellerReviewsLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                            <Skeleton className="h-7 w-12 mb-1" />
                            <Skeleton className="h-3 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Rating Distribution & Filters Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Rating Distribution Skeleton */}
                    <div className="border rounded-lg p-4">
                        <Skeleton className="h-6 w-40 mb-3" />
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="flex-1 h-2 rounded-full" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-2 border-t">
                            <Skeleton className="h-3 w-32 mx-auto" />
                        </div>
                    </div>

                    {/* Filters Skeleton */}
                    <div className="border rounded-lg p-4 space-y-4">
                        <Skeleton className="h-6 w-16" />
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                        <Skeleton className="h-9 w-full mt-2" />
                    </div>
                </div>

                {/* Right Column - Reviews List Skeleton */}
                <div className="lg:col-span-3">
                    <div className="mb-4 flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <ReviewsSkeleton />
                </div>
            </div>
        </div>
    );
}