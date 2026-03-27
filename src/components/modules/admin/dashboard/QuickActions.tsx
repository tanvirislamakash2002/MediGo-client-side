"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Users, 
    ShoppingCart, 
    Package, 
    AlertTriangle, 
    BarChart3, 
    Settings 
} from "lucide-react";

export function QuickActions() {
    const router = useRouter();

    const actions = [
        { label: "Manage Users", icon: Users, href: "/admin/users", color: "bg-blue-500" },
        { label: "View Orders", icon: ShoppingCart, href: "/admin/orders", color: "bg-green-500" },
        { label: "Categories", icon: Package, href: "/admin/categories", color: "bg-purple-500" },
        { label: "Low Stock", icon: AlertTriangle, href: "/admin/medicines?stock=low", color: "bg-red-500" },
        { label: "Reports", icon: BarChart3, href: "/admin/reports", color: "bg-orange-500" },
        { label: "Settings", icon: Settings, href: "/admin/settings", color: "bg-gray-500" },
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