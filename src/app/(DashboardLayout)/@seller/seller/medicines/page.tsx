import { getSellerMedicines } from "@/actions/medicine.action";
import { MedicinesGrid } from "@/components/modules/seller/medicines/MedicinesGrid";
import { MedicinesSearch } from "@/components/modules/seller/medicines/MedicinesSearch";
import { MedicinesHeader } from "@/components/modules/seller/medicines/MedicinesHeader";

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
            
            <MedicinesGrid 
                initialData={initialData}
                initialSearch={search}
                initialPage={page}
                initialLimit={limit}
            />
        </div>
    );
}