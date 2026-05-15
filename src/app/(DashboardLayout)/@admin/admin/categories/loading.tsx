import { CategoriesSkeleton } from "@/components/modules/admin/categories/CategoriesSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </div>

            {/* Search and Sort Bar Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2 flex-1 max-w-md">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-16" />
                </div>
                <Skeleton className="h-10 w-[140px]" />
            </div>

            {/* Table Skeleton */}
            <CategoriesSkeleton />
        </div>
    );
}