import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getMyOrders } from "@/actions/order.action";
import { OrdersHeader } from "@/components/modules/orders/OrdersHeader";
import { OrdersFilters } from "@/components/modules/orders/OrdersFilters";
import { OrdersSkeleton } from "@/components/modules/orders/OrdersSkeleton";
import { OrdersList } from "@/components/modules/orders/OrdersList";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
    const { data: session, error: sessionError } = await getSession();
    
    if (sessionError || !session) {
        redirect("/login?redirect=/orders");
    }
    
    const params = await searchParams;
    const status = params.status;
    const search = params.search;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;
    
    const result = await getMyOrders({ status, search, sort, page });
    const orders = result.error ? [] : result.data?.orders || [];
    const pagination = result.data?.pagination;
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <OrdersHeader orderCount={pagination?.total || 0} />
                
                <div className="mt-6">
                    <OrdersFilters 
                        initialStatus={status}
                        initialSearch={search}
                        initialSort={sort}
                    />
                    
                    <Suspense fallback={<OrdersSkeleton />}>
                        <OrdersList 
                            initialOrders={orders}
                            initialPage={page}
                            initialStatus={status}
                            initialSearch={search}
                            initialSort={sort}
                            pagination={pagination}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}