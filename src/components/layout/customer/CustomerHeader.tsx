"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import {
    ShoppingCart,
    User,
    Menu,
    X,
    Search,
    LogOut,
    Package,
    Heart,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SearchModal } from "./SearchModal";
import { CartDrawer } from "./CartDrawer";
import { env } from "@/env";
import { logout } from "@/actions/auth.action";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLogout } from "@/hooks/useLogout";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface CustomerHeaderProps {
    user: User | null;
}

const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/shop?view=categories" },
    // { name: "Offers", href: "/offers" },
    // { name: "About", href: "/about" },
    // { name: "Contact", href: "/contact" },
];

export function CustomerHeader({ user }: CustomerHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount } = useCart();
    const { logout } = useLogout();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Detect scroll for sticky header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/shop/");
        return pathname === href;
    };

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur border-b shadow-sm" : "bg-background border-b"
                }`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/shop" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                MediGo
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:inline">| Trusted Medicines</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            {/* Search Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden sm:flex"
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Cart Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCartOpen(true)}
                                className="relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </Button>

                            {/* User Menu */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-2 py-1.5">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/orders" className="cursor-pointer">
                                                <Package className="mr-2 h-4 w-4" />
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Profile Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href="/register">Sign Up</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-80">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col mt-6 space-y-4">
                        {/* Mobile Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search medicines..."
                                className="pl-9"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsSearchOpen(true);
                                }}
                                readOnly
                            />
                        </div>

                        {/* Mobile Navigation */}
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-t mt-4">
                            <span className="text-sm">Theme</span>
                            <ThemeToggle />
                        </div>
                        {user && (
                            <>
                                <div className="border-t pt-4">
                                    <Link
                                        href="/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted"
                                    >
                                        <Package className="h-4 w-4" />
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Profile Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}