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

interface MedicinesResponse {
    data: Medicine[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
}

interface ShopGridProps {
    initialData: MedicinesResponse | null;
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
    
    const [medicinesData, setMedicinesData] = useState<MedicinesResponse | null>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    // Get current values from URL
    const currentPage = parseInt(searchParams.get('page') || initialParams.initialPage.toString());

    // Fetch medicines when URL params change
    useEffect(() => {
        const fetchMedicines = async () => {
            setIsLoading(true);
            try {
                const result = await getMedicines({
                    search: searchParams.get('search') || "",
                    categoryId: searchParams.get('categoryId') || "",
                    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
                    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
                    manufacturer: searchParams.get('manufacturer') || "",
                    requiresPrescription: searchParams.has('requiresPrescription') ? true : undefined,
                    inStock: searchParams.has('inStock'),
                    sortBy: (searchParams.get('sortBy') as any) || "createdAt",
                    sortOrder: (searchParams.get('sortOrder') as any) || "desc",
                    page: currentPage,
                    limit: parseInt(searchParams.get('limit') || initialParams.initialLimit.toString())
                });
                
                if (!result.error) {
                    setMedicinesData(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch medicines:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedicines();
    }, [searchParams, currentPage]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    if (isLoading && !medicinesData) {
        return <ShopGridSkeleton limit={initialParams.initialLimit} />;
    }

    if (!medicinesData?.data?.length) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicinesData.data.map((medicine) => (
                    <MedicineCard
                        key={medicine.id}
                        medicine={medicine}
                        onAddToCart={() => {
                            // Handle add to cart
                            console.log("Add to cart:", medicine.id);
                        }}
                        onViewDetails={() => router.push(`/shop/${medicine.id}`)}
                    />
                ))}
            </div>

            {medicinesData.pagination && medicinesData.pagination.totalPage > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={medicinesData.pagination.page}
                        totalPages={medicinesData.pagination.totalPage}
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