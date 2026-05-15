import { ProfileSkeleton } from "@/components/modules/customer/profile/ProfileSkeleton";

export default function ProfileLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-9 w-9 bg-muted animate-pulse rounded-md" />
                    <div>
                        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                    </div>
                </div>
                <div className="h-8 w-32 bg-muted animate-pulse rounded-full" />
            </div>

            {/* Main Content Skeleton */}
            <ProfileSkeleton />
        </div>
    );
}