"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

interface WishlistSummaryProps {
    totalItems: number;
    totalValue: number;
    inStockCount: number;
}

export function WishlistSummary({ totalItems, totalValue, inStockCount }: WishlistSummaryProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const handleAddAllToCart = async () => {
        // This would need a bulk add to cart endpoint
        toast.info("Coming soon: Add all items at once");
    };

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-lg">Wishlist Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span>Total Items</span>
                        </div>
                        <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>In Stock</span>
                        </div>
                        <span className="font-medium text-green-600">{inStockCount}</span>
                    </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                    <span>Total Value</span>
                    <span className="font-bold text-lg text-primary">
                        ${totalValue.toFixed(2)}
                    </span>
                </div>
                
                <div className="space-y-2">
                    <Button 
                        className="w-full" 
                        onClick={handleAddAllToCart}
                        disabled={totalItems === 0}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add All to Cart
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => router.push("/shop")}
                    >
                        Continue Shopping
                    </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-2">
                    Free shipping on orders over $50
                </div>
            </CardContent>
        </Card>
    );
}