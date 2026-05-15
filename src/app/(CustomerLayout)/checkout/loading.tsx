// app/(CustomerLayout)/checkout/loading.tsx
import { CheckoutSkeleton } from "@/components/modules/checkout/CheckoutSkeleton";

export default function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64 mb-8" />
                    <CheckoutSkeleton />
                </div>
            </div>
        </div>
    );
}

// Import Skeleton
import { Skeleton } from "@/components/ui/skeleton";