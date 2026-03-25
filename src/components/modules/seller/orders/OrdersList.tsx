"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { getSellerOrders, updateOrderStatus } from "@/actions/order.action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { OrdersSkeleton } from "./OrdersSkeleton";
import { OrderCard } from "./OrderCard";
import { OrderDetailsModal } from "./OrderDetailsModal";

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
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [bulkStatus, setBulkStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

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
            if (!result.error) {
                setOrders(result?.data || []);
                setPagination(result.data?.pagination);
            }
            setIsLoading(false);
        };

        fetchOrders();
    }, [searchParams, initialStatus, initialSearch, initialSort]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(orders.map(order => order.id));
            setSelectedOrders(allIds);
        } else {
            setSelectedOrders(new Set());
        }
        setSelectAll(checked);
    };

    const handleSelectOrder = (orderId: string, checked: boolean) => {
        const newSelected = new Set(selectedOrders);
        if (checked) {
            newSelected.add(orderId);
        } else {
            newSelected.delete(orderId);
        }
        setSelectedOrders(newSelected);
        setSelectAll(newSelected.size === orders.length);
    };

    const handleBulkStatusUpdate = async () => {
        if (!bulkStatus) {
            toast.error("Please select a status to apply");
            return;
        }
        
        if (selectedOrders.size === 0) {
            toast.error("No orders selected");
            return;
        }
        
        setIsUpdating(true);
        const toastId = toast.loading(`Updating ${selectedOrders.size} orders to ${bulkStatus}...`);
        
        try {
            // Update each selected order
            const updatePromises = Array.from(selectedOrders).map(orderId =>
                updateOrderStatus(orderId, bulkStatus)
            );
            
            const results = await Promise.all(updatePromises);
            const errors = results.filter(r => r.error);
            
            if (errors.length > 0) {
                toast.error(`${errors.length} orders failed to update`, { id: toastId });
            } else {
                toast.success(`${selectedOrders.size} orders updated to ${bulkStatus}`, { id: toastId });
            }
            
            // Clear selections and refresh
            setSelectedOrders(new Set());
            setSelectAll(false);
            setBulkStatus("");
            router.refresh();
            
        } catch (error) {
            toast.error("Failed to update orders", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleClearSelection = () => {
        setSelectedOrders(new Set());
        setSelectAll(false);
        setBulkStatus("");
    };

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

    return (
        <>
            {/* Bulk Actions Bar */}
            {selectedOrders.size > 0 && (
                <div className="bg-muted/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
                        </span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleClearSelection}
                            className="text-muted-foreground"
                        >
                            Clear
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                            className="px-3 py-1.5 text-sm border rounded-md bg-background flex-1 sm:flex-initial"
                        >
                            <option value="">Select status...</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                        </select>
                        <Button 
                            onClick={handleBulkStatusUpdate}
                            disabled={!bulkStatus || isUpdating}
                            size="sm"
                        >
                            {isUpdating ? "Updating..." : "Apply"}
                        </Button>
                    </div>
                </div>
            )}
            
            {/* Orders List */}
            <div className="space-y-4">
                {/* Header with Select All */}
                <div className="flex items-center gap-4 pb-2 border-b">
                    <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">Select All</span>
                </div>
                
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        isSelected={selectedOrders.has(order.id)}
                        onSelect={(checked) => handleSelectOrder(order.id, checked)}
                        onViewDetails={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                        }}
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
                onRefresh={() => router.refresh()}
            />
        </>
    );
}