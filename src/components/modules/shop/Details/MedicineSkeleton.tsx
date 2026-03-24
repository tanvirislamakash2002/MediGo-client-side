import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MedicineSkeleton() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="w-16 h-16 rounded" />
                        <Skeleton className="w-16 h-16 rounded" />
                        <Skeleton className="w-16 h-16 rounded" />
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="border-t border-b py-4">
                        <Skeleton className="h-10 w-1/3" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="mt-12">
                <Skeleton className="h-10 w-full mb-6" />
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}