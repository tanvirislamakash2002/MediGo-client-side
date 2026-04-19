import { Suspense } from "react";
import { getCartItems } from "@/actions/cart.action";
import { CartSkeleton } from "@/components/modules/cart/CartSkeleton";
import { CartContent } from "@/components/modules/cart/CartContent";
import { CartItem } from "@/types/cart.type";
export const dynamic = 'force-dynamic';

export default async function CartPage() {
    const result = await getCartItems();
    const cartItems = !result.success ? null : result.data?.items || [];
    const cartTotal = cartItems?.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0) || 0;
// console.log(result);
//     if (!cartItems || cartItems.length === 0) {
//         return <EmptyCart />;
//     }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<CartSkeleton />}>
                    <CartContent 
                        initialItems={cartItems} 
                        initialTotal={cartTotal}
                    />
                </Suspense>
            </div>
        </div>
    );
}