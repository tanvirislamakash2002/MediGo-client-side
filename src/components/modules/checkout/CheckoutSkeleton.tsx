// src/components/modules/checkout/CheckoutSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Forms Skeleton */}
            <div className="lg:w-2/3 space-y-6">
                {/* Shipping Information Card */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Address Line 1 */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Address Line 2 */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* City and Postal Code Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>

                        {/* Delivery Instructions */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Prescription Upload Card Skeleton (optional - shows only if needed) */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-6 w-40" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Warning Alert Skeleton */}
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Skeleton className="h-4 w-4 mt-0.5" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>

                        {/* Upload Area Skeleton */}
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-64" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Order Summary Skeleton */}
            <div className="lg:w-1/3">
                <Card className="sticky top-24">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Items List Skeleton */}
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-5 w-20 mt-1" />
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>

                        <Skeleton className="h-px w-full" />

                        {/* Promo Code Section Skeleton */}
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </div>

                        {/* Totals Skeleton */}
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
                            <Skeleton className="h-px w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>

                        {/* Payment Method Skeleton */}
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                        </div>

                        {/* Place Order Button Skeleton */}
                        <Skeleton className="h-12 w-full" />

                        {/* Trust Badges Skeleton */}
                        <div className="space-y-2 pt-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-3 w-3" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}