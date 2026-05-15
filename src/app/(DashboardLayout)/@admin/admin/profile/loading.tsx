import { ProfileSkeleton } from "@/components/modules/admin/profile/ProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProfileLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9" />
                    <div>
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>

            {/* Profile Skeleton - Two column layout */}
            <ProfileSkeleton />
        </div>
    );
}