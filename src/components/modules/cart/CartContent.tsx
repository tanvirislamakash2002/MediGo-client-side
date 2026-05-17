'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { CartHeader } from "./CartHeader";
import { CartItems } from "./CartItems";
import { OrderSummary } from "./OrderSummary";
import { CartItem } from "@/types/cart.type";
import { useCart } from "@/hooks/useCart";
import { CartSkeleton } from "./CartSkeleton";
import { EmptyCart } from "./EmptyCart";

interface CartContentProps {
    initialItems: CartItem[];
    initialTotal: number;
}

export function CartContent({ initialItems, initialTotal }: CartContentProps) {
    const router = useRouter();
    const {
        cart,
        cartTotal,
        isLoading,
        isAuthenticated,
        refreshCart
    } = useCart();

    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
    const [selectedTotal, setSelectedTotal] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const hasRefreshed = useRef(false); // ✅ Track if refresh already happened

    // ✅ Use cart from hook if available, otherwise fallback to initial props
    const displayItems = cart;
    const displayTotal = cartTotal;

    useEffect(() => {
        setIsClient(true);
    }, []);

    // ✅ Only refresh once on initial client mount
    useEffect(() => {
        if (isClient && !hasRefreshed.current) {
            hasRefreshed.current = true;
            refreshCart();
        }
    }, [isClient, refreshCart]);

    // ✅ Memoize the selection change handler
    const handleSelectionChange = useCallback((items: CartItem[], total: number) => {
        setSelectedItems(items);
        setSelectedTotal(total);
    }, []);

    const handleCheckout = useCallback(() => {
        if (selectedItems.length === 0) return;

        // Get selected item IDs
        const selectedIds = selectedItems.map(item => item.id);

        // Navigate to checkout with selected IDs in URL
        router.push(`/checkout?selected=${selectedIds.join(',')}`);
    }, [selectedItems, router]);

    // ✅ Show loading state
    if (isLoading && !isClient) {
        return <CartSkeleton />;
    }

    if (displayItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <>
            <CartHeader itemCount={displayItems.length} />

            <div className="flex flex-col lg:flex-row gap-8 mt-6">
                {/* Left Column - Cart Items */}
                <div className="lg:w-2/3">
                    <CartItems
                        initialItems={displayItems}
                        onSelectionChange={handleSelectionChange}
                    />
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:w-1/3">
                    <OrderSummary
                        subtotal={displayTotal}
                        shippingCost={displayTotal > 50 ? 0 : 5.99}
                        tax={0}
                        total={displayTotal > 50 ? displayTotal : displayTotal + 5.99}
                        freeShippingThreshold={50}
                        selectedItems={selectedItems}
                        selectedTotal={selectedTotal}
                        onCheckout={handleCheckout}
                    />
                </div>
            </div>
        </>
    );
}