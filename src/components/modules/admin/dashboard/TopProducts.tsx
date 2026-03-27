import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
    name: string;
    sold: number;
    revenue: number;
}

interface TopProductsProps {
    products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Selling Products</CardTitle>
                <Badge variant="outline">Last 30 days</Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <div key={product.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Sold: {product.sold} units
                                    </p>
                                </div>
                            </div>
                            <span className="font-medium">${product.revenue.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}