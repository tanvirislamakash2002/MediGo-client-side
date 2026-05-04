import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getWishlist } from "@/actions/wishlist.action";
import { WishlistHeader } from "@/components/modules/customer/wishlist/WishlistHeader";
import { WishlistFilters } from "@/components/modules/customer/wishlist/WishlistFilters";
import { WishlistItems } from "@/components/modules/customer/wishlist/WishlistItems";
import { WishlistSummary } from "@/components/modules/customer/wishlist/WishlistSummary";
import { WishlistSkeleton } from "@/components/modules/customer/wishlist/WishlistSkeleton";

interface WishlistItem {
    id: string;
    medicineId: string;
    addedAt: string;
    medicine: {
        id: string;
        name: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        requiresPrescription: boolean;
        category: { id: string; name: string };
    };
}

interface PageProps {
    searchParams: Promise<{
        sort?: string;
        page?: string;
        inStock?: string;
    }>;
}

export default async function WishlistPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();

    if (!success || !session) {
        redirect("/login?redirect=/wishlist");
    }

    const params = await searchParams;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;
    const inStockFilter = params.inStock === "true";

    const result = await getWishlist(page, 12);
    const wishlistItems: WishlistItem[] = result.success ? result.data?.items || [] : [];
    const pagination = result.success ? result.data?.pagination : null;

    // Calculate totals
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => sum + (item.medicine?.price || 0), 0);
    const inStockCount = wishlistItems.filter(item => (item.medicine?.stock || 0) > 0).length;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <WishlistHeader totalItems={totalItems} />

                    <div className="mt-6 flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Filters (Desktop) */}
                        <div className="lg:w-64 flex-shrink-0">
                            <WishlistFilters
                                initialSort={sort}
                                initialInStockFilter={inStockFilter}
                            />
                        </div>

                        {/* Right Column - Wishlist Items */}
                        <div className="flex-1">
                            <Suspense fallback={<WishlistSkeleton />}>
                                <WishlistItems
                                    initialItems={wishlistItems}
                                    initialPage={page}
                                    initialSort={sort}
                                    initialInStockFilter={inStockFilter}
                                    pagination={pagination}
                                />
                            </Suspense>
                        </div>

                        {/* Right Sidebar - Summary (Desktop) */}
                        <div className="lg:w-80 flex-shrink-0">
                            <WishlistSummary
                                totalItems={totalItems}
                                totalValue={totalValue}
                                inStockCount={inStockCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}