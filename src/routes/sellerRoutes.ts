import { RouteGroup } from "@/types/routes.type";
import { LayoutDashboard, Package, ShoppingCart, Home, Plus } from "lucide-react";

export const sellerRoutes: RouteGroup[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                url: "/seller",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Medicines",
                url: "/seller/medicines",
                icon: Package,
            },
            {
                title: "Add Medicine",
                url: "/seller/medicines/add",
                icon: Plus,
            },
            {
                title: "Orders",
                url: "/seller/orders",
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