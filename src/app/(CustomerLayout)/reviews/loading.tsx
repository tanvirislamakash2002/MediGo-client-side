// app/(CustomerLayout)/reviews/loading.tsx
import { ReviewsSkeleton } from "@/components/modules/customer/reviews/ReviewsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewsLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton className="h-8 w-32 mb-2" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Stats & Filters Skeleton */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Review Stats Skeleton */}
                            <Card>
                                <CardContent className="p-4">
                                    <Skeleton className="h-6 w-32 mb-3" />
                                    <div className="text-center py-4 border-b">
                                        <Skeleton className="h-10 w-16 mx-auto mb-2" />
                                        <div className="flex justify-center gap-1 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Skeleton key={i} className="h-5 w-5" />
                                            ))}
                                        </div>
                                        <Skeleton className="h-4 w-32 mx-auto mt-2" />
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-12" />
                                                <Skeleton className="flex-1 h-2 rounded-full" />
                                                <Skeleton className="h-4 w-8" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Filters Skeleton */}
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    <Skeleton className="h-6 w-16 mb-3" />
                                    
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-10 flex-1" />
                                            <Skeleton className="h-10 w-16" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <div className="space-y-1">
                                            {["all", "5", "4", "3", "2", "1"].map((rating) => (
                                                <div key={rating} className="flex items-center gap-2">
                                                    <Skeleton className="h-3 w-3 rounded" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Reviews List Skeleton */}
                        <div className="lg:col-span-2">
                            <ReviewsSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}