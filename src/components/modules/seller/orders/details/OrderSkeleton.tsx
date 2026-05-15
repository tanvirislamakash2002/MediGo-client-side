import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            
            {/* Timeline Skeleton */}
            <div className="bg-muted/30 rounded-lg p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="relative">
                    <div className="flex justify-between">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-4 w-16 mt-2" />
                                <Skeleton className="h-3 w-12 mt-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items Skeleton */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="divide-y">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="p-4 flex gap-4">
                                    <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex flex-wrap justify-between gap-2">
                                            <div className="flex-1">
                                                <Skeleton className="h-5 w-40 mb-1" />
                                                <Skeleton className="h-4 w-32" />
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Skeleton className="h-5 w-24 rounded-full" />
                                                    <Skeleton className="h-5 w-20 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Skeleton className="h-5 w-16 mb-1" />
                                                <Skeleton className="h-4 w-12" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-muted/30 px-4 py-3 border-t flex justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>

                    {/* Customer Info Skeleton */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-5 w-48" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prescriptions Skeleton (optional - shows if there are prescriptions) */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="border rounded-lg overflow-hidden">
                                        <Skeleton className="h-40 w-full" />
                                        <div className="p-3">
                                            <div className="flex items-center justify-between">
                                                <Skeleton className="h-3 w-32" />
                                                <div className="flex gap-1">
                                                    <Skeleton className="h-8 w-8 rounded-md" />
                                                    <Skeleton className="h-8 w-8 rounded-md" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Order Summary Skeleton */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-px w-full my-2" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t space-y-2">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Actions Skeleton */}
                    <Card>
                        <CardHeader className="border-b">
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}