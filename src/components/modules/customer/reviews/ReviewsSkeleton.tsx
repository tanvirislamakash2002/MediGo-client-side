// src/components/modules/customer/reviews/ReviewsSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
    return (
        <div className="space-y-4">
            {/* Show results count skeleton */}
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-4 w-32" />
            </div>

            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Image Skeleton */}
                            <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                            
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        {/* Title Skeleton */}
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        {/* Stars Skeleton */}
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Skeleton key={j} className="h-4 w-4 rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Action Buttons Skeleton */}
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                                
                                {/* Comment Skeleton */}
                                <div className="mt-2 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                
                                {/* Footer Skeleton */}
                                <div className="flex justify-between mt-3">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-8 w-24" />
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