import { CartSkeleton } from "@/components/modules/cart/CartSkeleton";

export default function CartLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <CartSkeleton />
            </div>
        </div>
    );
}