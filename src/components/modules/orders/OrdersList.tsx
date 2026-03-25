"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { cancelOrder, getMyOrders } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { OrdersSkeleton } from "./OrdersSkeleton";
import { OrderCard } from "./OrderCard";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { toast } from "sonner";

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
        requiresPrescription: boolean;
    }[];
    shippingAddress: string;
    phone: string;
    deliveryInstructions?: string;
    estimatedDeliveryDate?: string;
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
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            const status = searchParams.get("status") || initialStatus;
            const search = searchParams.get("search") || initialSearch;
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            
            const result = await getMyOrders({ status, search, sort, page });
            if (!result.error) {
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
        router.push(`/orders?${params.toString()}`);
    };

    const handleReorder = async (order: Order) => {
        // Reorder logic - add all items to cart
        console.log("Reorder:", order.id);
    };

    const handleCancelOrder = async (order: Order) => {
    // Only allow cancellation for PLACED or PROCESSING orders
    if (order.status !== "PLACED" && order.status !== "PROCESSING") {
        toast.error("This order cannot be cancelled as it has already been processed or shipped.");
        return;
    }
    
    const toastId = toast.loading(`Cancelling order #${order.id.slice(0, 8).toUpperCase()}...`);
    
    try {
        const result = await cancelOrder(order.id);
        
        if (result.error) {
            toast.error(result.error.message, { id: toastId });
            return;
        }
        
        toast.success(`Order #${order.id.slice(0, 8).toUpperCase()} cancelled successfully`, { id: toastId });
        
        // Refresh orders list
        const status = searchParams.get("status") || initialStatus;
        const search = searchParams.get("search") || initialSearch;
        const sort = searchParams.get("sort") || initialSort;
        const page = parseInt(searchParams.get("page") || "1");
        
        const refreshResult = await getMyOrders({ status, search, sort, page });
        if (!refreshResult.error) {
            setOrders(refreshResult.data?.orders || []);
            setPagination(refreshResult.data?.pagination);
        }
    } catch (error) {
        toast.error("Failed to cancel order", { id: toastId });
    }
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
                        : "You haven't placed any orders yet"}
                </p>
                <Button onClick={() => router.push("/shop")}>
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                        }}
                        onReorder={() => handleReorder(order)}
                        onCancel={() => handleCancelOrder(order)}
                    />
                ))}
            </div>
            
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            
            <OrderDetailsModal
                isOpen={showDetailsModal}
                order={selectedOrder}
                onClose={() => setShowDetailsModal(false)}
                onReorder={handleReorder}
                onCancel={handleCancelOrder}
            />
        </>
    );
}