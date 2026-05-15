import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Metrics Cards Skeleton */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="p-4 pb-2">
                            <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                            <Skeleton className="h-3 w-24 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-9 w-28 rounded-md" />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Skeleton */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-20" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                            {[...Array(7)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-16" />
                            ))}
                        </div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                {[...Array(7)].map((_, j) => (
                                    <Skeleton key={j} className="h-4 w-16" />
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Low Stock Alerts Skeleton */}
            <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg">
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Products & Recent Reviews Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-6" />
                                        <div>
                                            <Skeleton className="h-5 w-32 mb-1" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton className="h-5 w-20 mb-1" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-20" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="border-b pb-3">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Skeleton key={j} className="h-3 w-3 rounded-full" />
                                            ))}
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-4 w-full mt-2" />
                                <Skeleton className="h-3 w-20 mt-1" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Summary & Store Performance Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex justify-between border-b pb-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed & Tips Recommendations Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 flex-1" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-950/30">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <Skeleton className="h-4 w-4 mt-0.5" />
                                    <Skeleton className="h-4 flex-1" />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}