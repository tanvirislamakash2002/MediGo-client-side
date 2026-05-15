import { DashboardSkeleton } from "@/components/modules/seller/dashboard/DashboardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerDashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                    <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>

            {/* Dashboard Skeleton */}
            <DashboardSkeleton />
        </div>
    );
}