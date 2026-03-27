import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Seller {
    name: string;
    products: number;
    orders: number;
    revenue: number;
    rating: number;
}

interface SellerPerformanceProps {
    sellers: Seller[];
}

export function SellerPerformance({ sellers }: SellerPerformanceProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Sellers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sellers.map((seller) => (
                        <div key={seller.name} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{seller.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {seller.products} products · {seller.orders} orders
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${seller.revenue.toFixed(2)}</p>
                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span>{seller.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}