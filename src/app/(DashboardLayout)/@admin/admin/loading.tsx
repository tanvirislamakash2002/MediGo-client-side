import { DashboardSkeleton } from "@/components/modules/admin/dashboard/DashboardSkeleton";

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted animate-pulse rounded mt-1" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-9 w-20 bg-muted animate-pulse rounded" />
                </div>
            </div>

            {/* Dashboard Skeleton */}
            <DashboardSkeleton />
        </div>
    );
}