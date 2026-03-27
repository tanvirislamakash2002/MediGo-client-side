import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Star, Package, ShoppingCart, DollarSign, Clock, BarChart } from "lucide-react";
import Link from "next/link";

interface StorePerformanceProps {
    performance?: {
        rating?: number;
        totalReviews?: number;
        totalProducts?: number;
        totalOrders?: number;
        totalSales?: number;
        completionRate?: number;
        responseTime?: string;
        satisfactionRate?: number;
    };
}

export function StorePerformance({ performance = {} }: StorePerformanceProps) {
    // Default values for all metrics
    const data = {
        rating: performance.rating ?? 0,
        totalReviews: performance.totalReviews ?? 0,
        totalProducts: performance.totalProducts ?? 0,
        totalOrders: performance.totalOrders ?? 0,
        totalSales: performance.totalSales ?? 0,
        completionRate: performance.completionRate ?? 100,
        responseTime: performance.responseTime ?? "24 hours",
        satisfactionRate: performance.satisfactionRate ?? 0,
    };

    const items = [
        { label: "Store Rating", value: data.rating > 0 ? `${data.rating.toFixed(1)} ⭐` : "No ratings", icon: Star, color: "text-yellow-500" },
        { label: "Total Reviews", value: data.totalReviews, icon: Star, color: "text-yellow-500" },
        { label: "Total Products", value: data.totalProducts, icon: Package, color: "text-blue-500" },
        { label: "Total Orders", value: data.totalOrders, icon: ShoppingCart, color: "text-green-500" },
        { label: "Total Sales", value: `$${data.totalSales.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
        { label: "Completion Rate", value: `${data.completionRate}%`, icon: TrendingUp, color: "text-green-500" },
        { label: "Response Time", value: data.responseTime, icon: Clock, color: "text-purple-500" },
        { label: "Satisfaction Rate", value: `${data.satisfactionRate}%`, icon: TrendingUp, color: "text-green-500" },
    ];

    // Check if there's any data to show
    const hasData = data.totalProducts > 0 || data.totalOrders > 0 || data.totalSales > 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Store Performance</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/seller/analytics">View Detailed Analytics →</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                                <div className={`p-2 rounded-lg bg-muted/30`}>
                                    <item.icon className={`h-4 w-4 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                    <p className="font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No performance data available yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Start selling to see your store performance metrics
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}