import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
                {/* Store Info Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Info Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                        </div>
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-6 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Business Hours Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Document Verification Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-6">
                            <div className="flex justify-center">
                                <Skeleton className="h-10 w-32" />
                            </div>
                            <Skeleton className="h-4 w-48 mx-auto mt-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Shipping Settings Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Return Policy Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Payout Info Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-6 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Notification Preferences Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Security Section Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Store Performance Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <div className="flex-1">
                                        <Skeleton className="h-3 w-20 mb-2" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone Skeleton */}
                <Card className="border-destructive/20">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}