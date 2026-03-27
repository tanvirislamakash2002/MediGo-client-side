"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Product {
    id: string;
    name: string;
    stock: number;
    threshold: number;
}

interface LowStockAlertsProps {
    products: Product[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
    if (products.length === 0) {
        return null;
    }

    const criticalProducts = products.filter(p => p.stock <= 5);
    const warningProducts = products.filter(p => p.stock > 5 && p.stock <= p.threshold);

    return (
        <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alerts ({products.length})
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/seller/medicines?stock=low">View All →</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {criticalProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-red-600">Stock: {product.stock} units (Critical)</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/seller/medicines/edit/${product.id}`}>Restock</Link>
                            </Button>
                        </div>
                    ))}
                    {warningProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200">
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-yellow-600">Stock: {product.stock} units (Low)</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/seller/medicines/edit/${product.id}`}>Restock</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}