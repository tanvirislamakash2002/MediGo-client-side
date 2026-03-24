import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ShopGridSkeletonProps {
    limit: number;
}

export function ShopGridSkeleton({ limit }: ShopGridSkeletonProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    {/* Image Skeleton */}
                    <div className="relative h-48 bg-muted">
                        <Skeleton className="h-full w-full" />
                    </div>

                    <CardContent className="p-4 space-y-3">
                        {/* Title Skeleton */}
                        <Skeleton className="h-6 w-3/4" />
                        
                        {/* Manufacturer Skeleton */}
                        <Skeleton className="h-4 w-1/2" />
                        
                        {/* Description Skeleton - 2 lines */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        
                        {/* Price and Stock Badge Skeleton */}
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        
                        {/* Buttons Skeleton */}
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}