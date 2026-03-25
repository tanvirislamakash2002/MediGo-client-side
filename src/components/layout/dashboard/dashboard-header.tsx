"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
    SidebarTrigger, 
    // SidebarTriggerIcon 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Bell, 
    Search, 
    User, 
    LogOut, 
    Settings,
    ChevronDown 
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { logout } from "@/actions/auth.action";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface DashboardHeaderProps {
    user: User;
}

// Generate breadcrumbs based on current path
const getBreadcrumbs = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    
    let currentPath = "";
    for (const segment of segments) {
        currentPath += `/${segment}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({
            label,
            href: currentPath,
            isLast: currentPath === pathname
        });
    }
    
    return breadcrumbs;
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const breadcrumbs = getBreadcrumbs(pathname);
    
    // Get page title from breadcrumbs
    const pageTitle = breadcrumbs.length > 0 
        ? breadcrumbs[breadcrumbs.length - 1].label 
        : "Dashboard";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${
            isScrolled 
                ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm" 
                : "bg-background border-b"
        }`}>
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left Section */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator 
                        orientation="vertical" 
                        className="h-4 hidden md:block" 
                    />
                    
                    {/* Breadcrumbs */}
                    <Breadcrumb className="hidden md:flex">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbs.length > 0 && (
                                <BreadcrumbSeparator />
                            )}
                            {breadcrumbs.map((crumb, index) => (
                                <BreadcrumbItem key={crumb.href}>
                                    {crumb.isLast ? (
                                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                    ) : (
                                        <>
                                            <BreadcrumbLink href={crumb.href}>
                                                {crumb.label}
                                            </BreadcrumbLink>
                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator />
                                            )}
                                        </>
                                    )}
                                </BreadcrumbItem>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                    
                    {/* Mobile page title */}
                    <span className="text-lg font-semibold md:hidden">
                        {pageTitle}
                    </span>
                </div>
                
                {/* Right Section */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Search Button (Mobile) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-9 w-9"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                    
                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="w-64 pl-9 pr-4"
                        />
                    </div>
                    
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                    </Button>
                    
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    
                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="hidden md:inline text-sm font-medium">
                                    {user.name}
                                </span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </p>
                                <p className="text-xs text-primary mt-1 capitalize">
                                    {user.role.toLowerCase()}
                                </p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop" className="cursor-pointer">
                                    <span className="mr-2">🏪</span>
                                    View Store
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleLogout} 
                                className="text-red-600 cursor-pointer"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            {/* Mobile Search Expanded */}
            {searchOpen && (
                <div className="md:hidden p-4 border-t">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </header>
    );
}