"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/actions/order.action";
import { toast } from "sonner";
import { OrdersSkeleton } from "./OrdersSkeleton";
import { BulkActionsBar } from "./BulkActionsBar";
import { OrderDetailsModal } from "./OrderDetailsModal";

// Updated Order interface to match OrderDetailsModal requirements
interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address?: string;
    };
    items: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        manufacturer: string;
        imageUrl?: string;
    }>;
    shippingAddress: string;
    phone: string;
    deliveryInstructions?: string;
    paymentMethod: string;
}

interface OrdersTableProps {
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

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PLACED":
            return { icon: Clock, label: "Placed", color: "bg-blue-500" };
        case "PROCESSING":
            return { icon: Package, label: "Processing", color: "bg-yellow-500" };
        case "SHIPPED":
            return { icon: Truck, label: "Shipped", color: "bg-purple-500" };
        case "DELIVERED":
            return { icon: CheckCircle, label: "Delivered", color: "bg-green-500" };
        case "CANCELLED":
            return { icon: XCircle, label: "Cancelled", color: "bg-red-500" };
        default:
            return { icon: Clock, label: status, color: "bg-gray-500" };
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function OrdersTable({ 
    initialOrders, 
    initialPage,
    initialStatus,
    initialSearch,
    initialSort,
    pagination: initialPagination 
}: OrdersTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

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
            
            const result = await getAllOrders({ status, search, sort, page, fromDate, toDate });
            if (!result.error) {
                setOrders(result.data?.orders || []);
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

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/admin/orders?${params.toString()}`);
    };

    if (isLoading && orders.length === 0) {
        return <OrdersSkeleton />;
    }

    return (
        <>
            {/* Bulk Actions Bar */}
            {selectedOrders.size > 0 && (
                <BulkActionsBar 
                    selectedCount={selectedOrders.size}
                    selectedIds={Array.from(selectedOrders)}
                    onClear={() => {
                        setSelectedOrders(new Set());
                        setSelectAll(false);
                    }}
                    onRefresh={() => router.refresh()}
                />
            )}
            
            {/* Orders Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden lg:table-cell">Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">No orders found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
                                const status = getStatusBadge(order.status);
                                const StatusIcon = status.icon;
                                
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedOrders.has(order.id)}
                                                onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.customer.name}</p>
                                                <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {formatDate(order.createdAt)}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${order.totalAmount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${status.color} text-white`}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowDetailsModal(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            
            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={showDetailsModal}
                order={selectedOrder}
                onClose={() => setShowDetailsModal(false)}
                onRefresh={() => router.refresh()}
            />
        </>
    );
}