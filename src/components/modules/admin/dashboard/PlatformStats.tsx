import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlatformStatsProps {
    stats: {
        totalProducts: number;
        totalCategories: number;
        totalSellers: number;
        totalCustomers: number;
        averageOrderValue: number;
        conversionRate: number;
        activeSessions: number;
    };
}

export function PlatformStats({ stats }: PlatformStatsProps) {
    const items = [
        { label: "Total Products", value: stats.totalProducts },
        { label: "Total Categories", value: stats.totalCategories },
        { label: "Total Sellers", value: stats.totalSellers },
        { label: "Total Customers", value: stats.totalCustomers },
        { label: "Average Order Value", value: `$${stats.averageOrderValue.toFixed(2)}` },
        { label: "Conversion Rate", value: `${stats.conversionRate}%` },
        { label: "Active Sessions", value: stats.activeSessions },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div key={item.label} className="flex justify-between border-b pb-2">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}