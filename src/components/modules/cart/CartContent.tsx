"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartHeader } from "./CartHeader";
import { CartItems } from "./CartItems";
import { OrderSummary } from "./OrderSummary";
import { CartItem } from "@/types/cart.type";

interface CartContentProps {
    initialItems: CartItem[];
    initialTotal: number;
}

export function CartContent({ initialItems, initialTotal }: CartContentProps) {
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
    const [selectedTotal, setSelectedTotal] = useState(0);

    const handleSelectionChange = (items: CartItem[], total: number) => {
        console.log("CartContent - Selected items:", items);
        console.log("CartContent - Selected total:", total);
        setSelectedItems(items);
        setSelectedTotal(total);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        
        // Get selected item IDs
        const selectedIds = selectedItems.map(item => item.id);
        
        // Navigate to checkout with selected IDs in URL
        router.push(`/checkout?selected=${selectedIds.join(',')}`);
    };

    return (
        <>
            <CartHeader itemCount={initialItems.length} />

            <div className="flex flex-col lg:flex-row gap-8 mt-6">
                {/* Left Column - Cart Items */}
                <div className="lg:w-2/3">
                    <CartItems 
                        initialItems={initialItems} 
                        onSelectionChange={handleSelectionChange}
                    />
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:w-1/3">
                    <OrderSummary
                        subtotal={initialTotal}
                        shippingCost={initialTotal > 50 ? 0 : 5.99}
                        tax={0}
                        total={initialTotal > 50 ? initialTotal : initialTotal + 5.99}
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