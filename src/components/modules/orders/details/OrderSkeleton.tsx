import { Skeleton } from "@/components/ui/skeleton";

export function OrderSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32 mt-2" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
            
            <Skeleton className="h-32 w-full" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );
}