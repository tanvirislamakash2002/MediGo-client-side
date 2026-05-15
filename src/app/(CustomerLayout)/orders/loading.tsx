// app/(CustomerLayout)/orders/loading.tsx
import { OrdersSkeleton } from "@/components/modules/customer/orders/OrdersSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-48 mt-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 mb-8">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 text-center">
                                <Skeleton className="w-8 h-8 rounded-full mx-auto mb-2" />
                                <Skeleton className="h-7 w-12 mx-auto mb-1" />
                                <Skeleton className="h-3 w-16 mx-auto" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="space-y-4 mb-6">
                    <div className="flex flex-wrap gap-2 border-b pb-2">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-9 w-20 rounded-lg" />
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex gap-2 flex-1 max-w-md">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                {/* Orders */}
                <OrdersSkeleton />
            </div>
        </div>
    );
}