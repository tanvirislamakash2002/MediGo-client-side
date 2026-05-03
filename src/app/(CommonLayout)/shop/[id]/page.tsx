import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMedicineById } from "@/actions/medicine.action";
import { Breadcrumb } from "@/components/modules/shop/Details/Breadcrumb";
import { MedicineSkeleton } from "@/components/modules/shop/Details/MedicineSkeleton";
import { MedicineHero } from "@/components/modules/shop/Details/MedicineHero";
import { MedicineActions } from "@/components/modules/shop/Details/MedicineActions";
import { MedicineInfoTabs } from "@/components/modules/shop/Details/MedicineInfoTabs";
import { RelatedMedicines } from "@/components/modules/shop/Details/RelatedMedicines";
import { ReviewsSection } from "@/components/modules/shop/Details/ReviewsSection";
import { getSession } from "@/actions/auth.action";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const result = await getMedicineById(id);
    const medicine = result?.success ? result?.data : null;
    if (!medicine) {
        return {
            title: "Medicine Not Found | MediStore",
            description: "The requested medicine could not be found."
        };
    }

    return {
        title: `${medicine.name} - ${medicine.manufacturer} | MediStore`,
        description: medicine.description.length > 160
            ? medicine.description.substring(0, 160) + "..."
            : medicine.description,
        openGraph: {
            title: medicine.name,
            description: medicine.description.length > 160
                ? medicine.description.substring(0, 160) + "..."
                : medicine.description,
            images: medicine.imageUrl ? [medicine.imageUrl] : [],
        },
    };
}

export default async function MedicineDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const [medicineResult, session] = await Promise.all([
        getMedicineById(id),
        getSession()
    ]);

    const medicine = medicineResult?.success ? medicineResult?.data : null;
    const user = session.success ? session.data?.user : null;

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

                        {/* Reviews Section */}
                        <ReviewsSection
                            medicineId={medicine.id}
                            initialReviews={medicine.reviews || []}
                            averageRating={medicine.averageRating || 0}
                            totalReviews={medicine.totalReviews || 0}
                            isAuthenticated={!!user}
                            hasPurchased={medicine.userHasPurchased || false}
                            userHasReviewed={medicine.userHasReviewed || false}
                        />
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