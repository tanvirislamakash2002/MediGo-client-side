import { OrdersSkeleton } from "@/components/modules/admin/orders/OrdersSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-7 w-12" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters Skeleton */}
            <div className="space-y-4">
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1 border-b pb-2">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24 rounded-lg" />
                    ))}
                </div>

                {/* Search, Sort, Date Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2 flex-1">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            </div>

            {/* Orders Table Skeleton */}
            <OrdersSkeleton />
        </div>
    );
}