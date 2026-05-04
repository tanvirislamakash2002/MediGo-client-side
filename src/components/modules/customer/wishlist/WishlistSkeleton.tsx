"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WishlistSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="w-24 h-24 rounded-md" />
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between gap-2">
                                    <div>
                                        <Skeleton className="h-5 w-48 mb-2" />
                                        <Skeleton className="h-4 w-32" />
                                        <div className="flex gap-2 mt-2">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-7 w-20" />
                                </div>
                                <div className="flex gap-4 mt-3">
                                    <Skeleton className="h-3 w-32" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}