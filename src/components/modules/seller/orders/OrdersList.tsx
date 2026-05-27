"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { getSellerOrders } from "@/actions/order.action";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { OrdersSkeleton } from "./OrdersSkeleton";
import { OrderCard } from "./OrderCard";

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string | null;
        manufacturer: string;
        status: string;
    }[];
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    shippingAddress: string;
    phone: string;
    deliveryInstructions?: string;
}

interface OrdersListProps {
    initialOrders: Order[];
    initialPage: number;
    initialStatus?: string;
    initialSearch?: string;
    initialSort?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export function OrdersList({
    initialOrders,
    initialPage,
    initialStatus,
    initialSearch,
    initialSort,
    pagination: initialPagination
}: OrdersListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            const status = searchParams.get("status") || initialStatus;
            const search = searchParams.get("search") || initialSearch;
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            const fromDate = searchParams.get("fromDate") || undefined;
            const toDate = searchParams.get("toDate") || undefined;

            const result = await getSellerOrders({ status, search, sort, page, fromDate, toDate });
            if (result.success) {
                setOrders(result.data?.orders || []);
                setPagination(result.data?.pagination);
            }
            setIsLoading(false);
        };

        fetchOrders();
    }, [searchParams, initialStatus, initialSearch, initialSort]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/seller/orders?${params.toString()}`);
    };

    if (isLoading && orders.length === 0) {
        return <OrdersSkeleton />;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                    <Package className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                    {searchParams.get("search")
                        ? "No orders match your search criteria"
                        : "You don't have any orders yet"}
                </p>
            </div>
        );
    }

    const handleStatusUpdate = () => {
        // Refresh the orders list when status is updated
        const fetchOrders = async () => {
            const status = searchParams.get("status") || initialStatus;
            const search = searchParams.get("search") || initialSearch;
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            const fromDate = searchParams.get("fromDate") || undefined;
            const toDate = searchParams.get("toDate") || undefined;

            const result = await getSellerOrders({ status, search, sort, page, fromDate, toDate });
            if (result.success) {
                setOrders(result.data?.orders || []);
                setPagination(result.data?.pagination);
            }
        };

        fetchOrders();
    };
    return (
        <>
            {/* Orders List */}
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={() => router.push(`/seller/orders/${order.id}`)}
                        onStatusUpdate={handleStatusUpdate}
                    />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}