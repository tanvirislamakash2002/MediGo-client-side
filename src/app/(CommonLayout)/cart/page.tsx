import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCartItems } from "@/actions/cart.action";
import { EmptyCart } from "@/components/modules/cart/EmptyCart";
import { CartHeader } from "@/components/modules/cart/CartHeader";
import { CartSkeleton } from "@/components/modules/cart/CartSkeleton";
import { CartItems } from "@/components/modules/cart/CartItems";
import { OrderSummary } from "@/components/modules/cart/OrderSummary";

interface CartItem {
    id: string;
    medicineId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
}

export default async function CartPage() {
    const result = await getCartItems();
    // console.log(result);
    const cartItems = result.error ? null : result.data?.items || [];
    const cartTotal = cartItems?.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0) || 0;

    if (!cartItems || cartItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <CartHeader itemCount={cartItems.length} />

                <div className="flex flex-col lg:flex-row gap-8 mt-6">
                    {/* Left Column - Cart Items */}
                    <div className="lg:w-2/3">
                        <Suspense fallback={<CartSkeleton />}>
                            <CartItems initialItems={cartItems} />
                        </Suspense>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3">
                        <OrderSummary
                            subtotal={cartTotal}
                            shippingCost={cartTotal > 50 ? 0 : 5.99}
                            tax={0}
                            total={cartTotal > 50 ? cartTotal : cartTotal + 5.99}
                            freeShippingThreshold={50}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}