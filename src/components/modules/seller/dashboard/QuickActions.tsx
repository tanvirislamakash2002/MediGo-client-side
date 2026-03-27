"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Package, 
    ShoppingCart, 
    AlertTriangle, 
    Star, 
    BarChart3, 
    Settings,
    Plus
} from "lucide-react";

export function QuickActions() {
    const router = useRouter();

    const actions = [
        { label: "Add Medicine", icon: Plus, href: "/seller/medicines/add", color: "bg-blue-500" },
        { label: "View Orders", icon: ShoppingCart, href: "/seller/orders", color: "bg-green-500" },
        { label: "Low Stock", icon: AlertTriangle, href: "/seller/medicines?stock=low", color: "bg-red-500" },
        { label: "View Reviews", icon: Star, href: "/seller/reviews", color: "bg-yellow-500" },
        { label: "Reports", icon: BarChart3, href: "/seller/reports", color: "bg-purple-500" },
        { label: "Store Settings", icon: Settings, href: "/seller/profile", color: "bg-gray-500" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            onClick={() => router.push(action.href)}
                            className="gap-2"
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}