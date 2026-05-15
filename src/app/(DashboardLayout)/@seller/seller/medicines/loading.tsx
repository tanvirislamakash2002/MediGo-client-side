import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MedicinesLoading() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Search Bar Skeleton */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="w-32">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medicines Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4">
                            {/* Image Skeleton */}
                            <Skeleton className="h-48 w-full mb-4 rounded-md" />
                            
                            {/* Title Skeleton */}
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            
                            {/* Category Skeleton */}
                            <Skeleton className="h-4 w-24 mb-3" />
                            
                            {/* Price Skeleton */}
                            <div className="flex justify-end mb-2">
                                <Skeleton className="h-6 w-20" />
                            </div>
                            
                            {/* Description Skeleton */}
                            <div className="space-y-2 mb-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            
                            {/* Manufacturer Skeleton */}
                            <Skeleton className="h-3 w-32 mb-3" />
                            
                            {/* Stock Badge Skeleton */}
                            <Skeleton className="h-6 w-28 rounded-full mb-4" />
                            
                            {/* Buttons Skeleton */}
                            <div className="flex gap-2">
                                <Skeleton className="h-10 flex-1 rounded-md" />
                                <Skeleton className="h-10 flex-1 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <Skeleton className="h-4 w-64" />
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