import { ProfileSkeleton } from "@/components/modules/seller/profile/ProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerProfileLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-64 mt-1" />
                    </div>
                </div>
            </div>

            {/* Profile Skeleton */}
            <ProfileSkeleton />
        </div>
    );
}