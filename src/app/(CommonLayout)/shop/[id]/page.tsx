import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMedicineById } from "@/actions/medicine.action";
import { Breadcrumb } from "@/components/modules/shop/Details/Breadcrumb";
import { MedicineSkeleton } from "@/components/modules/shop/Details/MedicineSkeleton";
import { MedicineHero } from "@/components/modules/shop/Details/MedicineHero";
import { MedicineActions } from "@/components/modules/shop/Details/MedicineActions";
import { MedicineInfoTabs } from "@/components/modules/shop/Details/MedicineInfoTabs";
import { RelatedMedicines } from "@/components/modules/shop/Details/RelatedMedicines";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const result = await getMedicineById(id);
    const medicine = result.error ? null : result.data;
console.log(result);
    if (!medicine) {
        return {
            title: "Medicine Not Found | MediStore",
            description: "The requested medicine could not be found."
        };
    }

    return {
        title: `${medicine.name} - ${medicine.manufacturer} | MediStore`,
        description: medicine.description.substring(0, 160),
        openGraph: {
            title: medicine.name,
            description: medicine.description.substring(0, 160),
            images: medicine.imageUrl ? [medicine.imageUrl] : [],
        },
    };
}

export default async function MedicineDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const result = await getMedicineById(id);
    const medicine = result.error ? null : result.data;

    if (!medicine) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumb medicineName={medicine.name} />
                
                <div className="mt-6">
                    <Suspense fallback={<MedicineSkeleton />}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Image */}
                            <MedicineHero medicine={medicine} />
                            
                            {/* Right Column - Key Info & Actions */}
                            <MedicineActions medicine={medicine} />
                        </div>
                        
                        {/* Tabs Section */}
                        <MedicineInfoTabs medicine={medicine} />
                        
                        {/* Related Medicines */}
                        <RelatedMedicines 
                            categoryId={medicine.categoryId}
                            currentMedicineId={medicine.id}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}