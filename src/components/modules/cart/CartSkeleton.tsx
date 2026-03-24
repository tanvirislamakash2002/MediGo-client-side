import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg" />
                            <div className="flex-1 space-y-3">
                                <div>
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-16" />
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