import { CartItem } from "./cart.type";

export interface OrderSummaryProps {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    freeShippingThreshold: number;
    selectedItems?: CartItem[];
    selectedTotal?: number;
    onCheckout?: () => void;
}