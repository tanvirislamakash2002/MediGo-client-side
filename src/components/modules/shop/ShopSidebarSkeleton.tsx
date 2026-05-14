// src/components/modules/shop/ShopSidebarSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ShopSidebarSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Categories Section */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <div className="space-y-2 pt-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-24 ml-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range Section */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-full" />
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>

                {/* Manufacturer Section */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32 ml-2" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24 ml-2" />
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}