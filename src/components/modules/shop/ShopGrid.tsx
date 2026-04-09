"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MedicineCard } from "@/components/modules/shop/MedicineCard";
import { Pagination } from "@/components/ui/pagination";
import { getMedicines } from "@/actions/medicine.action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
    category: { id: string; name: string };
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

interface ShopGridProps {
    initialData: { data: Medicine[]; pagination: PaginationData } | Medicine[] | null;
    initialSearch: string;
    initialCategoryId: string;
    initialMinPrice?: number;
    initialMaxPrice?: number;
    initialManufacturer: string;
    initialRequiresPrescription?: boolean;
    initialInStock: boolean;
    initialSortBy: string;
    initialSortOrder: string;
    initialPage: number;
    initialLimit: number;
}

export function ShopGrid({ initialData, ...initialParams }: ShopGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Normalize initial data - handle both array and object formats
    const getNormalizedData = (data: any) => {
        if (!data) return { medicines: [], pagination: null };
        if (Array.isArray(data)) {
            return { medicines: data, pagination: null };
        }
        return { 
            medicines: data.data || [], 
            pagination: data.pagination || null 
        };
    };

    const normalized = getNormalizedData(initialData);
    const [medicines, setMedicines] = useState<Medicine[]>(normalized.medicines);
    const [pagination, setPagination] = useState<PaginationData | null>(normalized.pagination);
    const [isLoading, setIsLoading] = useState(false);

    // Get current values from URL
    const currentPage = parseInt(searchParams.get('page') || initialParams.initialPage.toString());
    const currentLimit = parseInt(searchParams.get('limit') || initialParams.initialLimit.toString());

    // Fetch medicines when URL params change
    useEffect(() => {
        const fetchMedicines = async () => {
            setIsLoading(true);
            try {
                const result = await getMedicines({
                    search: searchParams.get('search') || undefined,
                    categoryId: searchParams.get('categoryId') || undefined,
                    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
                    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
                    manufacturer: searchParams.get('manufacturer') || undefined,
                    requiresPrescription: searchParams.has('requiresPrescription') ? true : undefined,
                    inStock: searchParams.has('inStock'),
                    sortBy: (searchParams.get('sortBy') as any) || "createdAt",
                    sortOrder: (searchParams.get('sortOrder') as any) || "desc",
                    page: currentPage,
                    limit: currentLimit
                });

                if (result.success) {
                    const data = result.data;
                    // Handle both array and object responses
                    if (Array.isArray(data)) {
                        setMedicines(data);
                        setPagination(null);
                    } else {
                        setMedicines(data?.data || []);
                        setPagination(data?.pagination || null);
                    }
                } else {
                    setMedicines([]);
                    setPagination(null);
                }
            } catch (err) {
                console.error("Failed to fetch medicines:", err);
                setMedicines([]);
                setPagination(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedicines();
    }, [searchParams, currentPage, currentLimit]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    // Show skeleton on initial load
    if (isLoading && medicines.length === 0) {
        return <ShopGridSkeleton limit={currentLimit} />;
    }

    // Show no results message
    if (!medicines || medicines.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <p className="text-muted-foreground mb-4">No medicines found matching your criteria</p>
                    <Button onClick={() => router.push("/shop")}>Clear Filters</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Optional: Show loading overlay when refreshing */}
            {isLoading && (
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicines.map((medicine) => (
                    <MedicineCard
                        key={medicine.id}
                        medicine={medicine}
                        onViewDetails={() => router.push(`/shop/${medicine.id}`)}
                    />
                ))}
            </div>

            {/* Show pagination if available */}
            {pagination && pagination.totalPage > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}

function ShopGridSkeleton({ limit }: { limit: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <div className="h-48 bg-muted animate-pulse rounded-md mb-4" />
                        <div className="h-4 bg-muted animate-pulse rounded mb-2 w-3/4" />
                        <div className="h-4 bg-muted animate-pulse rounded mb-2 w-1/2" />
                        <div className="h-6 bg-muted animate-pulse rounded mb-4 w-1/3" />
                        <div className="h-10 bg-muted animate-pulse rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}