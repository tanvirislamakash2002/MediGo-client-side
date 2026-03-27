import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventorySummaryProps {
    summary: {
        totalProducts: number;
        activeProducts: number;
        draftProducts: number;
        outOfStock: number;
        lowStock: number;
        categoriesUsed: number;
    };
}

export function InventorySummary({ summary }: InventorySummaryProps) {
    const items = [
        { label: "Total Products", value: summary.totalProducts },
        { label: "Active Products", value: summary.activeProducts },
        { label: "Draft Products", value: summary.draftProducts },
        { label: "Out of Stock", value: summary.outOfStock },
        { label: "Low Stock (<10)", value: summary.lowStock },
        { label: "Categories Used", value: summary.categoriesUsed },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
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