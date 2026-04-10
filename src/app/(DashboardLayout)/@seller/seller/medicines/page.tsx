import { Suspense } from "react";
import { getMedicines, getSellerMedicines } from "@/actions/medicine.action";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicinesGrid } from "@/components/modules/seller/MedicinesGrid";
import { MedicinesSearch } from "@/components/modules/seller/MedicinesSearch";
import { MedicinesHeader } from "@/components/modules/seller/MedicinesHeader";

interface PageProps {
    searchParams: Promise<{ 
        page?: string; 
        search?: string; 
        limit?: string 
    }>;
}

export default async function MedicinesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const search = params.search || "";
    const limit = params.limit ? parseInt(params.limit) : 9;

    // Fetch initial data on the server
    const result = await getSellerMedicines({ 
        search, 
        page, 
        limit 
    });

    const initialData = !result.success ? null : result?.data;

    return (
        <div className="container mx-auto py-6 space-y-6">
            <MedicinesHeader />
            
            <MedicinesSearch 
                initialSearch={search}
                initialLimit={limit}
            />
            
            <Suspense fallback={<MedicinesGridSkeleton limit={limit} />}>
                <MedicinesGrid 
                    initialData={initialData}
                    initialSearch={search}
                    initialPage={page}
                    initialLimit={limit}
                />
            </Suspense>
        </div>
    );
}

// Skeleton component for loading state
function MedicinesGridSkeleton({ limit }: { limit: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4">
                        <Skeleton className="h-48 w-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}