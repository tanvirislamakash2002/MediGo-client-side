import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info Card Skeleton */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-16" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar Skeleton */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full" />
                            </div>
                            <Skeleton className="h-5 w-16" />
                        </div>

                        {/* Profile Fields Skeleton */}
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Cards Skeleton */}
            <div className="lg:col-span-2 space-y-6">
                {/* Security Section Card Skeleton */}
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

                {/* Preferences Section Card Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Theme Selection */}
                        <div>
                            <Skeleton className="h-4 w-24 mb-3" />
                            <div className="flex gap-3">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 flex-1" />
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-40" />
                            <div className="space-y-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-5 w-11 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>

                {/* Activity Log Section Card Skeleton */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-8 w-20" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-32" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>

                        {/* Logs List */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-5 w-16" />
                                        </div>
                                        <Skeleton className="h-4 w-3/4 mt-1" />
                                        <div className="flex items-center gap-4 mt-2">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone Card Skeleton */}
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