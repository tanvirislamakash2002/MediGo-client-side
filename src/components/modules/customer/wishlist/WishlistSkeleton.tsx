// src/components/modules/customer/wishlist/WishlistSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WishlistSkeleton() {
    return (
        <div className="space-y-4">
            {/* Bulk Actions Bar Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-32" />
            </div>

            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Checkbox Skeleton */}
                            <Skeleton className="h-4 w-4 mt-1" />
                            
                            {/* Image Skeleton */}
                            <Skeleton className="w-24 h-24 rounded-md flex-shrink-0" />
                            
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between gap-2">
                                    <div>
                                        {/* Title Skeleton */}
                                        <Skeleton className="h-5 w-48 mb-2" />
                                        <Skeleton className="h-4 w-32" />
                                        {/* Badges Skeleton */}
                                        <div className="flex gap-2 mt-2">
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                    </div>
                                    {/* Price Skeleton */}
                                    <Skeleton className="h-7 w-20" />
                                </div>
                                
                                {/* Delivery Info Skeleton */}
                                <div className="flex gap-4 mt-3">
                                    <Skeleton className="h-3 w-32" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                
                                {/* Added Date Skeleton */}
                                <Skeleton className="h-3 w-24 mt-2" />
                                
                                {/* Action Buttons Skeleton */}
                                <div className="flex gap-2 mt-4">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-64" />
            </div>
        </div>
    );
}