// app/(CommonLayout)/shop/loading.tsx
import { ShopHero } from "@/components/modules/shop/ShopHero";
import { ShopSidebarSkeleton } from "@/components/modules/shop/ShopSidebarSkeleton";
import { ShopGridSkeleton } from "@/components/modules/shop/ShopGridSkeleton";

export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-background">
            <ShopHero />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <aside className="lg:w-80 shrink-0">
                        <ShopSidebarSkeleton />
                    </aside>

                    {/* Main Content Skeleton */}
                    <main className="flex-1">
                        {/* Header Skeleton */}
                        <div className="mb-6 space-y-4">
                            <div className="relative">
                                <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                <div className="flex gap-3">
                                    <div className="h-10 w-[180px] bg-muted animate-pulse rounded-md" />
                                    <div className="h-10 w-[120px] bg-muted animate-pulse rounded-md" />
                                </div>
                            </div>
                        </div>
                        
                        <ShopGridSkeleton limit={12} />
                    </main>
                </div>
            </div>
        </div>
    );
}