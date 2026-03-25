import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getSellerOrders } from "@/actions/order.action";
import { OrdersHeader } from "@/components/modules/seller/orders/OrdersHeader";
import { OrdersFilters } from "@/components/modules/seller/orders/OrdersFilters";
import { OrdersList } from "@/components/modules/seller/orders/OrdersList";
import { OrdersSkeleton } from "@/components/modules/seller/orders/OrdersSkeleton";
import { StatsCards } from "@/components/modules/seller/orders/StatsCards";

interface PageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        sort?: string;
        fromDate?: string;
        toDate?: string;
        page?: string;
    }>;
}

export default async function SellerOrdersPage({ searchParams }: PageProps) {
    const { data: session, error: sessionError } = await getSession();
    
    if (sessionError || !session || session.user.role !== "SELLER") {
        redirect("/login?redirect=/seller/orders");
    }
    
    const params = await searchParams;
    const status = params.status;
    const search = params.search;
    const sort = params.sort || "newest";
    const fromDate = params.fromDate;
    const toDate = params.toDate;
    const page = params.page ? parseInt(params.page) : 1;
    
    const result = await getSellerOrders({ 
        status, 
        search, 
        sort, 
        fromDate, 
        toDate, 
        page 
    });
    
    const orders = result.error ? [] : result.data?.orders || [];
    const stats = result.data?.stats || {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    const pagination = result.data?.pagination;
    
    return (
        <div className="space-y-6">
            <OrdersHeader orderCount={stats.total} />
            
            <StatsCards stats={stats} />
            
            <OrdersFilters 
                initialStatus={status}
                initialSearch={search}
                initialSort={sort}
                initialFromDate={fromDate}
                initialToDate={toDate}
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
    );
}