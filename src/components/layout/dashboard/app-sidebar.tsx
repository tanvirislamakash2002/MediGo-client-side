"use client";

import * as React from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
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
    LogOut,
    ChevronRight,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Roles } from "@/constants/roles";
import { adminRoutes, sellerRoutes } from "@/routes";
import { getProfileRoute, isActiveRoute } from "@/constants/routes";
import { User as UserType } from "@/types";
import { useLogout } from "@/hooks/useLogout";



interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: UserType;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const { logout } = useLogout();
    const profileRoute = getProfileRoute(user.role)

    // Select routes based on user role
    const routes = user.role === Roles.admin ? adminRoutes : sellerRoutes;

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Sidebar
            collapsible="icon"
            className="border-r shrink-0 h-screen sticky top-0"
            {...props}
        >
            {/* Sidebar Header - Fixed */}
            <SidebarHeader className="border-b px-4 py-4 h-16 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent whitespace-nowrap">
                        MediGo
                    </span>
                    <span className="text-xs text-muted-foreground hidden group-data-[collapsible=icon]:hidden">
                        {user.role === Roles.admin ? "Admin" : "Seller"}
                    </span>
                </Link>
            </SidebarHeader>

            {/* Sidebar Content - Scrollable */}
            <SidebarContent className="flex-1 overflow-y-auto">
                {routes.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-2">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActiveRoute(pathname, item.url);

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                                                <Link href={item.url} className="flex items-center gap-3">
                                                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                                                    <span className="truncate">{item.title}</span>
                                                    {active && (
                                                        <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0" />
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

            {/* Sidebar Footer - Fixed */}
            <SidebarFooter className="border-t p-4 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3 min-w-0">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
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
                        <Link href={profileRoute}>
                            <User className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="group-data-[collapsible=icon]:hidden truncate">Profile</span>
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden truncate">Logout</span>
                    </Button>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}