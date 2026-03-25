import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-5 w-5 rounded mt-1" />
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, idx) => (
                                                <Skeleton key={idx} className="w-8 h-8 rounded-full" />
                                            ))}
                                        </div>
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-28" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}