// src/components/modules/cart/CartSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
    return (
        <>
            {/* Header Skeleton */}
            <div className="mb-6">
                {/* Breadcrumb Skeleton */}
                <div className="flex items-center space-x-2 text-sm mb-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                </div>
                
                {/* Title Skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-6">
                {/* Left Column - Cart Items Skeleton */}
                <div className="lg:w-2/3 space-y-4">
                    {/* Selection Controls Skeleton */}
                    <div className="flex items-center justify-between pb-2 border-b">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    {/* Cart Items */}
                    {[...Array(2)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Checkbox Skeleton */}
                                    <Skeleton className="h-4 w-4 mt-1 rounded" />
                                    
                                    {/* Image Skeleton */}
                                    <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg flex-shrink-0" />
                                    
                                    {/* Product Details Skeleton */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <Skeleton className="h-6 w-48 mb-2" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            {/* Quantity Selector Skeleton */}
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-8" />
                                                <div className="flex items-center border rounded-md">
                                                    <Skeleton className="h-8 w-8" />
                                                    <Skeleton className="h-8 w-12" />
                                                    <Skeleton className="h-8 w-8" />
                                                </div>
                                            </div>
                                            
                                            {/* Price Skeleton */}
                                            <Skeleton className="h-4 w-16" />
                                            
                                            {/* Remove Button Skeleton */}
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Right Column - Order Summary Skeleton */}
                <div className="lg:w-1/3">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-32 mb-4" />
                            
                            {/* Free Shipping Progress Skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-2 w-full" />
                            </div>
                            
                            {/* Order Lines Skeleton */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                            
                            <Skeleton className="h-px w-full" />
                            
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            
                            {/* Promo Code Skeleton */}
                            <div className="flex gap-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                            
                            {/* Checkout Button Skeleton */}
                            <Skeleton className="h-12 w-full" />
                            
                            {/* Trust Badges Skeleton */}
                            <div className="space-y-3 pt-4 border-t">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}