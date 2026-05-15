import { WishlistSkeleton } from "@/components/modules/customer/wishlist/WishlistSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function WishlistLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Skeleton */}
                    <div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                        <Skeleton className="h-4 w-64 mt-1" />
                    </div>

                    <div className="mt-6 flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Filters Skeleton */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="space-y-6">
                                {/* Sort By Section */}
                                <Card>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-6 w-16 mb-3" />
                                        <div className="space-y-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <Skeleton className="h-3 w-3 rounded-full" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Filter Section */}
                                <Card>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-6 w-16 mb-3" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3 w-3" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Price Range Section */}
                                <Card>
                                    <CardContent className="p-4 space-y-3">
                                        <Skeleton className="h-6 w-24 mb-2" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-9 flex-1" />
                                            <Skeleton className="h-9 flex-1" />
                                        </div>
                                        <Skeleton className="h-9 w-full" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Right Column - Wishlist Items Skeleton */}
                        <div className="flex-1">
                            <WishlistSkeleton />
                        </div>

                        {/* Right Sidebar - Summary Skeleton */}
                        <div className="lg:w-80 flex-shrink-0">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                    </div>
                                    
                                    <Skeleton className="h-px w-full" />
                                    
                                    <div className="flex justify-between">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    
                                    <Skeleton className="h-3 w-32 mx-auto" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}