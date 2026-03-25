"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    Tags,
    Home,
    Settings,
    LogOut,
    ChevronRight,
    Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/actions/auth.action";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: User;
}

// Route definitions
const sellerRoutes = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                url: "/seller/dashboard",
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
                title: "View Store",
                url: "/shop",
                icon: Store,
            },
            {
                title: "Home",
                url: "/",
                icon: Home,
            },
        ],
    },
];

const adminRoutes = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
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
                title: "View Store",
                url: "/shop",
                icon: Store,
            },
            {
                title: "Home",
                url: "/",
                icon: Home,
            },
        ],
    },
];

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const routes = user.role === "ADMIN" ? adminRoutes : sellerRoutes;
    
    const isActive = (url: string) => {
        if (url === "/") return pathname === url;
        return pathname.startsWith(url);
    };
    
    const handleLogout = async () => {
        await logout();
    };
    
    // Get user initials
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    
    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b px-4 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        MediGo
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {user.role === "ADMIN" ? "Admin" : "Seller"}
                    </span>
                </Link>
            </SidebarHeader>
            
            <SidebarContent>
                {routes.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.url);
                                    
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={active}>
                                                <Link href={item.url} className="flex items-center gap-3">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                    {active && (
                                                        <ChevronRight className="h-3 w-3 ml-auto" />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            
            <SidebarFooter className="border-t p-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/profile">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </SidebarFooter>
            
            <SidebarRail />
        </Sidebar>
    );
}