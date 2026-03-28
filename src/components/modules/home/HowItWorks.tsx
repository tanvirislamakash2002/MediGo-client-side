"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, ShoppingCart, Truck, CheckCircle2 } from "lucide-react";

interface Step {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    number: number;
}

const steps: Step[] = [
    {
        number: 1,
        icon: <Search className="h-8 w-8" />,
        title: "Browse & Select",
        description: "Explore our wide range of 10,000+ authentic medicines. Filter by category, brand, or health condition to find exactly what you need.",
        badge: "10,000+ Products",
    },
    {
        number: 2,
        icon: <ShoppingCart className="h-8 w-8" />,
        title: "Add to Cart",
        description: "Select quantity, check prescription requirements, and add items to your cart. Review your order before checkout.",
        badge: "Prescription Available",
    },
    {
        number: 3,
        icon: <Truck className="h-8 w-8" />,
        title: "Fast Delivery",
        description: "Choose cash on delivery or pay online. Get your medicines delivered to your doorstep in 2-4 business days with real-time tracking.",
        badge: "Free Delivery Over $50",
    },
];

export function HowItWorks() {
    const router = useRouter();

    return (
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Simple & Easy</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Get your medicines delivered in three easy steps
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">
                    {/* Desktop Connecting Lines - Hidden on mobile */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 transform -translate-y-1/2">
                        <div className="absolute left-1/3 top-1/2 w-2 h-2 bg-primary rounded-full -translate-y-1/2" />
                        <div className="absolute left-2/3 top-1/2 w-2 h-2 bg-primary rounded-full -translate-y-1/2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative group"
                            >
                                {/* Step Card */}
                                <div className="bg-card rounded-2xl border shadow-sm p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Icon Container */}
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        {step.icon}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-muted-foreground text-sm mb-3">
                                        {step.description}
                                    </p>

                                    {/* Badge */}
                                    {step.badge && (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                                            <CheckCircle2 className="h-3 w-3 text-primary" />
                                            <span>{step.badge}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Features Row */}
                <div className="mt-12 flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Free delivery on orders over $50</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Cash on delivery available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Real-time order tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Prescription upload available</span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        onClick={() => router.push("/shop")}
                        className="gap-2 group"
                    >
                        Start Shopping
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
}