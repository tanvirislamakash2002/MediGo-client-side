import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";

interface CartHeaderProps {
    itemCount: number;
}

export function CartHeader({ itemCount }: CartHeaderProps) {
    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary transition-colors">
                    Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Cart</span>
            </nav>
            
            {/* Page Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
                    <p className="text-muted-foreground mt-1">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
                <Link 
                    href="/shop" 
                    className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}