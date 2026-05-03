"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <Skeleton className="w-16 h-16 rounded-md" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Skeleton key={j} className="h-4 w-4 rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                                <Skeleton className="h-16 w-full mt-2" />
                                <div className="flex justify-between mt-3">
                                    <Skeleton className="h-3 w-24" />
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