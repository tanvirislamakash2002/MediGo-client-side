// src/components/modules/shop/Details/MedicineDetailsSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function MedicineDetailsSkeleton() {
    return (
        <>
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div className="space-y-4">
                        <Skeleton className="aspect-square rounded-lg w-full" />
                        <div className="flex gap-2">
                            <Skeleton className="w-16 h-16 rounded" />
                            <Skeleton className="w-16 h-16 rounded" />
                            <Skeleton className="w-16 h-16 rounded" />
                        </div>
                    </div>

                    {/* Right Column - Info */}
                    <div className="space-y-6">
                        <div>
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="mt-2">
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>

                        <div className="border-t border-b py-4">
                            <div className="flex items-baseline justify-between">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10" />
                                <Skeleton className="h-10 w-20" />
                                <Skeleton className="h-10 w-10" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Skeleton className="h-12 flex-1" />
                            <Skeleton className="h-12 w-12" />
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <div className="flex border-b gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-none" />
                        ))}
                    </div>
                    <Card>
                        <CardContent className="p-6">
                            <Skeleton className="h-40 w-full" />
                        </CardContent>
                    </Card>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>

                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <Skeleton className="h-5 w-32 mb-1" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                            <div className="mt-3">
                                                <Skeleton className="h-4 w-full mb-2" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Related Medicines */}
                <div className="mt-12">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <Skeleton className="h-32 w-full mb-3" />
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-6 w-1/3 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}