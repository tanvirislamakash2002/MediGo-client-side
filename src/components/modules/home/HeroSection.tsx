"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Truck, Wallet, Headphones, Clock, Pill, Heart } from "lucide-react";

export function HeroSection() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const trustBadges = [
        {
            icon: Shield,
            title: "100% Genuine",
            description: "Authentic medicines",
        },
        {
            icon: Truck,
            title: "Free Delivery",
            description: "On orders over $50",
        },
        {
            icon: Wallet,
            title: "Cash on Delivery",
            description: "Pay when you receive",
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "Always here to help",
        },
        {
            icon: Clock,
            title: "Fast Delivery",
            description: "2-4 business days",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
            </div>

            {/* Floating Medical Icons */}
            <div className="absolute top-1/4 left-[5%] animate-float-slow hidden lg:block">
                <Pill className="h-12 w-12 text-primary/20" />
            </div>
            <div className="absolute bottom-1/3 right-[8%] animate-float-fast hidden lg:block">
                <Heart className="h-10 w-10 text-primary/20" />
            </div>
            <div className="absolute top-2/3 left-[15%] animate-float-medium hidden lg:block">
                <Pill className="h-8 w-8 text-primary/20 rotate-45" />
            </div>

            {/* Content Container */}
            <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Trusted by 10,000+ customers</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                        Your Trusted
                        <span className="text-primary"> Online Medicine</span>
                        <br />
                        Shop
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Get authentic medicines delivered to your doorstep with care and reliability. 
                        Shop from 10,000+ products with free delivery on orders over $50.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search for medicines, brands, or health conditions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 h-12 text-base bg-background border-2 focus:border-primary"
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-12 px-6">
                                Search
                            </Button>
                        </div>
                    </form>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                        {trustBadges.map((badge, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all"
                            >
                                <div className="p-2 rounded-full bg-primary/10">
                                    <badge.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm">{badge.title}</p>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <Button variant="outline" size="sm" onClick={() => router.push("/shop")}>
                            Browse Categories
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => router.push("/offers")}>
                            View Offers →
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-12"
                >
                    <path
                        d="M0 32L48 42.7C96 53.3 192 74.7 288 80C384 85.3 480 74.7 576 69.3C672 64 768 64 864 69.3C960 74.7 1056 85.3 1152 80C1248 74.7 1344 53.3 1392 42.7L1440 32V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V32Z"
                        fill="currentColor"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    );
}