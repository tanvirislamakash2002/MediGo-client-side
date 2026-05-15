import { OrderSkeleton } from "@/components/modules/seller/orders/details/OrderSkeleton";

export default function SellerOrderDetailsLoading() {
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