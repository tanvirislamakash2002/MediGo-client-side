"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Product {
    name: string;
    unitsSold: number;
    revenue: number;
    growth: number;
}

interface TopProductsProps {
    products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Selling Products</CardTitle>
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
                                        {product.unitsSold} units sold
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${product.revenue.toFixed(2)}</p>
                                <div className={`flex items-center gap-1 text-xs ${product.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {product.growth >= 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(product.growth)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}