import { OrderSkeleton } from "@/components/modules/customer/orders/details/OrderSkeleton";

export default function OrderDetailsLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <OrderSkeleton />
                </div>
            </div>
        </div>
    );
}