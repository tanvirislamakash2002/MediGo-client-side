import { CategorySkeleton } from "@/components/modules/categories/CategorySkeleton";

export default function CategoriesLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* You can also add skeleton for header if needed */}
                <div className="mb-8">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-96 bg-muted animate-pulse rounded" />
                </div>
                <CategorySkeleton />
            </div>
        </div>
    );
}