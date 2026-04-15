import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getOrderById } from "@/actions/order.action";
import { OrderHeader } from "@/components/modules/seller/orders/details/OrderHeader";
import { OrderTimeline } from "@/components/modules/seller/orders/details/OrderTimeline";
import { OrderItems } from "@/components/modules/seller/orders/details/OrderItems";
import { CustomerInfo } from "@/components/modules/seller/orders/details/CustomerInfo";
import { OrderSummary } from "@/components/modules/seller/orders/details/OrderSummary";
import { OrderActions } from "@/components/modules/seller/orders/details/OrderActions";
import { OrderSkeleton } from "@/components/modules/seller/orders/details/OrderSkeleton";

interface PageProps {
    params: Promise<{ orderId: string }>;
}

export default async function SellerOrderDetailsPage({ params }: PageProps) {
    const { orderId } = await params;

    // Check authentication
    const { data: session, success } = await getSession();
    if (!success || !session || session.user.role !== "SELLER") {
        redirect("/login?redirect=/seller/orders");
    }

    // Fetch order details
    const result = await getOrderById(orderId);
    if (!result.success || !result.data) {
        notFound();
    }

    const order = result.data;

    // Ensure items array exists
    const safeOrder = {
        ...order,
        items: order.orderItems || order.items || []
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <Suspense fallback={<OrderSkeleton />}>
                        <OrderHeader order={safeOrder} />

                        <div className="mt-8">
                            <OrderTimeline order={safeOrder} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <OrderItems order={safeOrder} />
                                <CustomerInfo order={safeOrder} />
                            </div>
                            <div className="space-y-8">
                                <OrderSummary order={safeOrder} />
                                <OrderActions order={safeOrder} />
                            </div>
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}