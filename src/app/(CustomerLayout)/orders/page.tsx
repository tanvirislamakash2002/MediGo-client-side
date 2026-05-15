// app/(CustomerLayout)/orders/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getMyOrders } from "@/actions/order.action";
import { OrdersHeader } from "@/components/modules/customer/orders/OrdersHeader";
import { OrdersFilters } from "@/components/modules/customer/orders/OrdersFilters";
import { OrdersList } from "@/components/modules/customer/orders/OrdersList";
import { OrderStats } from "@/components/modules/customer/orders/OrderStats";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        status?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();

    if (!success || !session) {
        redirect("/login?redirect=/orders");
    }

    const params = await searchParams;
    const status = params.status;
    const search = params.search;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;

    const result = await getMyOrders({ status, search, sort, page });
    const orders = !result.success ? [] : result.data?.orders || [];
    const pagination = result.data?.pagination;
    const stats = result.data?.stats || {
        total: 0,
        placed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <OrdersHeader orderCount={pagination?.total || 0} />

                <OrderStats stats={stats} />
                
                <div className="mt-6">
                    <OrdersFilters
                        initialStatus={status}
                        initialSearch={search}
                        initialSort={sort}
                    />

                    <OrdersList
                        initialOrders={orders}
                        initialPage={page}
                        initialStatus={status}
                        initialSearch={search}
                        initialSort={sort}
                        pagination={pagination}
                    />
                </div>
            </div>
        </div>
    );
}