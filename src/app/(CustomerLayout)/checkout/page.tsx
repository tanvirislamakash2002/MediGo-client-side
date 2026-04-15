import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { CheckoutForm } from "@/components/modules/checkout/CheckoutForm";
import { CheckoutSkeleton } from "@/components/modules/checkout/CheckoutSkeleton";
import { getSelectedCartItems } from "@/actions/cart.action";

interface CheckoutPageProps {
    searchParams: Promise<{ selected?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const params = await searchParams;
    const selectedIds = params.selected ? params.selected.split(',') : [];
    
    const { data: session } = await getSession();

    // Get selected cart items using the IDs from URL
    const result = await getSelectedCartItems(selectedIds);
    const cartItems = !result.success ? [] : result.data?.items || [];
    const cartTotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
                    <p className="text-muted-foreground mb-8">Complete your order information</p>

                    <Suspense fallback={<CheckoutSkeleton />}>
                        <CheckoutForm
                            initialItems={cartItems}
                            initialTotal={cartTotal}
                            user={session.user}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}