import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getOrderById } from "@/actions/order.action";
import { OrderHeader } from "@/components/modules/orders/details/OrderHeader";
import { OrderTimeline } from "@/components/modules/orders/details/OrderTimeline";
import { OrderItems } from "@/components/modules/orders/details/OrderItems";
import { ShippingInfo } from "@/components/modules/orders/details/ShippingInfo";
import { OrderSummary } from "@/components/modules/orders/details/OrderSummary";
import { OrderActions } from "@/components/modules/orders/details/OrderActions";
import { ReviewSection } from "@/components/modules/orders/details/ReviewSection";
import { OrderSkeleton } from "@/components/modules/orders/details/OrderSkeleton";



interface PageProps {
    params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { orderId } = await params;
    return {
        title: `Order #${orderId.slice(0, 8).toUpperCase()} | MediGo`,
        description: "View your order details and tracking information",
    };
}

export default async function OrderDetailsPage({ params }: PageProps) {
    const { orderId } = await params;
    
    // Check authentication
    const { data: session, error: sessionError } = await getSession();
    if (sessionError || !session) {
        redirect(`/login?redirect=/order/${orderId}`);
    }
    
    // Fetch order details
    const result = await getOrderById(orderId);
    if (result.error || !result.data) {
        notFound();
    }
    
    const order = result.data;
    
    // Verify this order belongs to the logged-in user
    if (order.customerId !== session.user.id) {
        redirect("/orders");
    }
    
    // Ensure items is always an array
    const safeOrder = {
        ...order,
        items: order.items || []
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
                                <ShippingInfo order={safeOrder} />
                                {safeOrder.status === "DELIVERED" && (
                                    <ReviewSection order={safeOrder} />
                                )}
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