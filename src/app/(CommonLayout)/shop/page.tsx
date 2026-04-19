import { Suspense } from "react";
import { getCategories } from "@/actions/category.action";
import { getMedicines } from "@/actions/medicine.action";
import { ShopHero } from "@/components/modules/shop/ShopHero";
import { ShopSidebar } from "@/components/modules/shop/ShopSidebar";
import { ShopHeader } from "@/components/modules/shop/ShopHeader";
import { ShopGrid } from "@/components/modules/shop/ShopGrid";
import { ShopGridSkeleton } from "@/components/modules/shop/ShopGridSkeleton";
export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        search?: string;
        categoryId?: string;
        minPrice?: string;
        maxPrice?: string;
        manufacturer?: string;
        requiresPrescription?: string;
        inStock?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Parse search params
    const search = params.search || "";
    const categoryId = params.categoryId || "";
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
    const manufacturer = params.manufacturer || "";
    const requiresPrescription = params.requiresPrescription === "true" ? true :
        params.requiresPrescription === "false" ? false : undefined;
    const inStock = params.inStock === "true";
    const sortBy = (params.sortBy as "price" | "name" | "createdAt") || "createdAt";
    const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";
    const page = params.page ? parseInt(params.page) : 1;
    const limit = params.limit ? parseInt(params.limit) : 12;

    // Fetch categories for sidebar
    const categoriesResult = await getCategories();
    const categories = !categoriesResult.success ? [] : categoriesResult?.data?.categories;

    // Fetch medicines
    const medicinesResult = await getMedicines({
        search,
        categoryId,
        minPrice,
        maxPrice,
        manufacturer,
        requiresPrescription,
        inStock,
        sortBy,
        sortOrder,
        page,
        limit
    });
    const medicinesData = !medicinesResult.success ? null : medicinesResult?.data;
    
    return (
        <div className="min-h-screen bg-background">
            <ShopHero />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Server Component */}
                    <aside className="lg:w-80 shrink-0">
                        <ShopSidebar
                            categories={categories}
                            initialCategoryId={categoryId}
                            initialMinPrice={minPrice}
                            initialMaxPrice={maxPrice}
                            initialManufacturer={manufacturer}
                            initialRequiresPrescription={requiresPrescription}
                            initialInStock={inStock}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <ShopHeader
                            totalResults={medicinesData?.pagination?.total || 0}
                            initialSortBy={sortBy}
                            initialSortOrder={sortOrder}
                            initialLimit={limit}
                        />

                        <Suspense fallback={<ShopGridSkeleton limit={limit} />}>
                            <ShopGrid
                                initialData={medicinesData}
                                initialSearch={search}
                                initialCategoryId={categoryId}
                                initialMinPrice={minPrice}
                                initialMaxPrice={maxPrice}
                                initialManufacturer={manufacturer}
                                initialRequiresPrescription={requiresPrescription}
                                initialInStock={inStock}
                                initialSortBy={sortBy}
                                initialSortOrder={sortOrder}
                                initialPage={page}
                                initialLimit={limit}
                            />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    );
}