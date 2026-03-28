import { Suspense } from "react";
import { getAllCategories } from "@/actions/category.action";
import { CategoriesHeader } from "@/components/modules/categories/CategoriesHeader";
import { CategoryGrid } from "@/components/modules/categories/CategoryGrid";
import { CategorySkeleton } from "@/components/modules/categories/CategorySkeleton";
import { CategoryBanner } from "@/components/modules/categories/CategoryBanner";
import { CategoryFAQ } from "@/components/modules/categories/CategoryFAQ";

export const metadata = {
    title: "Medicine Categories | MediGo",
    description: "Browse medicines by health conditions, categories, and therapeutic areas. Find pain relief, vitamins, cold & flu, allergy relief, and more.",
};

export default async function CategoriesPage() {
    const result = await getAllCategories({ limit: 100 });
    console.log(result);
    if (result.error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-muted-foreground">{result.error.message}</p>
            </div>
        );
    }

    const categories = result.data?.data?.categories || [];
    const pagination = result.data?.data?.pagination;

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <CategoriesHeader />
                <Suspense fallback={<CategorySkeleton />}>
                    <CategoryGrid categories={categories} pagination={pagination} />
                </Suspense>
                <CategoryBanner />
                <CategoryFAQ />
            </div>
        </main>
    );
}