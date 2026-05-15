// app/(CustomerLayout)/cart/page.tsx
import { getCartItems } from "@/actions/cart.action";
import { CartContent } from "@/components/modules/cart/CartContent";
import { CartItem } from "@/types/cart.type";

export const dynamic = 'force-dynamic';

export default async function CartPage() {
    const result = await getCartItems();
    const cartItems = !result.success ? null : result.data?.items || [];
    const cartTotal = cartItems?.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0) || 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <CartContent 
                    initialItems={cartItems} 
                    initialTotal={cartTotal}
                />
            </div>
        </div>
    );
}