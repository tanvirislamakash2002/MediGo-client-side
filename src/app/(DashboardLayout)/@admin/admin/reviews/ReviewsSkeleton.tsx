"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="divide-y">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex gap-4">
                        <Skeleton className="h-10 w-10 rounded" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}