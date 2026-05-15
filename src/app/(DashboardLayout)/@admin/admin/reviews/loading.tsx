import { ReviewsSkeleton } from "@/components/modules/admin/reviews/ReviewsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminReviewsLoading() {
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

            {/* Left and Right Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Stats & Distribution Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Skeleton className="h-5 w-5 rounded-full" />
                                    </div>
                                    <Skeleton className="h-7 w-12 mb-1" />
                                    <Skeleton className="h-3 w-16" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Rating Distribution Skeleton */}
                    <Card>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-32 mb-3" />
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-8" />
                                        <Skeleton className="flex-1 h-2 rounded-full" />
                                        <Skeleton className="h-4 w-8" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Reviews Table Skeleton */}
                <div className="lg:col-span-3">
                    {/* Filters Skeleton */}
                    <div className="border rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                            <div className="flex gap-2 md:col-span-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-16" />
                            </div>
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Reviews Table Skeleton */}
                    <ReviewsSkeleton />
                </div>
            </div>
        </div>
    );
}