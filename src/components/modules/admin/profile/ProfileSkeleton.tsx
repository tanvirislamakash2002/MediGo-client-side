import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
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

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="flex justify-between">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}