// app/(CommonLayout)/shop/[id]/loading.tsx
import { MedicineDetailsSkeleton } from "@/components/modules/shop/Details/MedicineDetailsSkeleton";

export default function MedicineDetailsLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                <MedicineDetailsSkeleton />
            </div>
        </div>
    );
}