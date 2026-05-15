import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Product Image Skeleton */}
                            <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                            
                            <div className="flex-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                    <div>
                                        {/* Product Name */}
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        {/* Stars */}
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Skeleton key={j} className="h-4 w-4 rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Date and Avatar */}
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                                
                                {/* Review Comment */}
                                <div className="mt-2 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-3">
                                    <Skeleton className="h-8 w-28" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center">
                <div className="flex gap-1">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                </div>
            </div>
        </div>
    );
}