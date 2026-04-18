import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getAllCategories } from "@/actions/category.action";
import { CategoriesHeader } from "@/components/modules/admin/categories/CategoriesHeader";
import { CategoriesSkeleton } from "@/components/modules/admin/categories/CategoriesSkeleton";
import { CategoriesTable } from "@/components/modules/admin/categories/CategoriesTable";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();
    
    // Only admin can access
    if (!success || !session || session.user.role !== "ADMIN") {
        redirect("/login?redirect=/admin/categories");
    }
    
    const params = await searchParams;
    const search = params.search;
    const sort = params.sort || "name";
    const page = params.page ? parseInt(params.page) : 1;
    
    const result = await getAllCategories({ search, sort, page });
    const categories = !result.success ? [] : result.data?.categories || [];
    const pagination = result.data?.pagination;
    return (
        <div className="space-y-6">
            <CategoriesHeader />
            
            <Suspense fallback={<CategoriesSkeleton />}>
                <CategoriesTable 
                    initialCategories={categories}
                    initialSearch={search}
                    initialSort={sort}
                    initialPage={page}
                    pagination={pagination}
                />
            </Suspense>
        </div>
    );
}