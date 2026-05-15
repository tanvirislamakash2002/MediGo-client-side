// src/components/modules/customer/orders/details/OrderSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function OrderSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
                <div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-4 w-64 mt-1" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            
            {/* Timeline Skeleton */}
            <Skeleton className="h-32 w-full rounded-lg" />
            
            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Card Skeleton */}
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="w-20 h-20 rounded-lg" />
                                        <div className="flex-1">
                                            <Skeleton className="h-5 w-40 mb-2" />
                                            <Skeleton className="h-4 w-32 mb-2" />
                                            <Skeleton className="h-6 w-24" />
                                        </div>
                                        <div className="text-right">
                                            <Skeleton className="h-5 w-16 mb-1" />
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Shipping Info Skeleton */}
                    <Card>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-8">
                    {/* Order Summary Skeleton */}
                    <Card>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <Skeleton className="h-px w-full my-2" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Actions Skeleton */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}