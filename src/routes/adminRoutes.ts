import { RouteGroup } from "@/types/routes.type";
import { LayoutDashboard, Users, Tags, ShoppingCart, Home } from "lucide-react";

export const adminRoutes: RouteGroup[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Users",
                url: "/admin/users",
                icon: Users,
            },
            {
                title: "Categories",
                url: "/admin/categories",
                icon: Tags,
            },
            {
                title: "Orders",
                url: "/admin/orders",
                icon: ShoppingCart,
            },
        ],
    },
    {
        title: "Quick Links",
        items: [
            {
                title: "Home",
                url: "/",
                icon: Home,
            },
        ],
    },
];
