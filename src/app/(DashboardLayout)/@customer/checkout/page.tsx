import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getSelectedCartItems } from "@/actions/cart.action";
import { CheckoutForm } from "@/components/modules/checkout/CheckoutForm";
import { CheckoutSkeleton } from "@/components/modules/checkout/CheckoutSkeleton";

export default async function CheckoutPage() {
    const { data: session, error: sessionError } = await getSession();
    // Redirect to login if not authenticated
    if (sessionError || !session) {
        redirect(`/login?redirect=/checkout`);
    }

    // Get selected cart items (from query param or localStorage)
    const result = await getSelectedCartItems();
    const cartItems = result.error ? [] : result.data?.items || [];
    const cartTotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    if (cartItems.length === 0) {
        redirect("/cart");
    }

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