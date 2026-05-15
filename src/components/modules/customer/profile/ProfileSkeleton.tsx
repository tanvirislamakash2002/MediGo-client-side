import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
                {/* Personal Info Card Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-16" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-5 w-48" />
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </CardContent>
                </Card>

                {/* Address Book Card Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-24" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-48 mb-1" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardContent>
                </Card>

                {/* Order Summary Card Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-20" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Skeleton className="h-5 w-5" />
                                <div>
                                    <Skeleton className="h-3 w-20 mb-1" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Skeleton className="h-5 w-5" />
                                <div>
                                    <Skeleton className="h-3 w-20 mb-1" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                                    <div>
                                        <Skeleton className="h-4 w-20 mb-1" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="text-right">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Security Section Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5" />
                                    <div>
                                        <Skeleton className="h-5 w-32 mb-1" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Notification Preferences Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-8 w-16" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-6 w-11 rounded-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Wishlist Summary Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-20" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 border rounded-lg">
                                <Skeleton className="h-12 w-12 rounded-md" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Reviews Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-20" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                        </div>
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                                <div className="flex gap-3">
                                    <Skeleton className="h-12 w-12 rounded-md" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Skeleton className="h-4 w-32 mb-1" />
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Skeleton key={j} className="h-3 w-3" />
                                                    ))}
                                                </div>
                                            </div>
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                        <Skeleton className="h-3 w-full mt-2" />
                                        <Skeleton className="h-3 w-32 mt-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Danger Zone Skeleton */}
                <Card className="border-destructive/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border border-destructive/50 rounded-lg">
                            <div>
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}