import { UsersSkeleton } from "@/components/modules/admin/users/UsersSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="p-3 pb-1">
                            <Skeleton className="h-3 w-16" />
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-8" />
                                <Skeleton className="h-6 w-6 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters Skeleton */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2 flex-1">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
            </div>

            {/* Users Table Skeleton */}
            <UsersSkeleton />
        </div>
    );
}