import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface StorePerformanceProps {
    performance: {
        averageRating: number;
        totalReviews: number;
        totalViews: number;
        conversionRate: number;
        repeatCustomers: number;
        averageResponseTime: string;
    };
}

export function StorePerformance({ performance }: StorePerformanceProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Store Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Store Rating</span>
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i < Math.floor(performance.averageRating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">
                                {performance.averageRating.toFixed(1)} ({performance.totalReviews} reviews)
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Views</span>
                        <span className="font-medium">{performance.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="font-medium">{performance.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Repeat Customers</span>
                        <span className="font-medium">{performance.repeatCustomers}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Response Time</span>
                        <span className="font-medium">{performance.averageResponseTime}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}