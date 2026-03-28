"use client";

import { useEffect, useRef, useState } from "react";
import { 
    Shield, 
    Truck, 
    Wallet, 
    Headphones, 
    Clock, 
    RotateCcw,
    Star,
    Users,
    Award
} from "lucide-react";

interface TrustIndicator {
    icon: React.ReactNode;
    title: string;
    description: string;
    metric?: string;
}

const indicators: TrustIndicator[] = [
    {
        icon: <Shield className="h-8 w-8" />,
        title: "100% Genuine Medicines",
        description: "All medicines sourced from licensed manufacturers with full traceability and quality testing.",
        metric: "10,000+ Products",
    },
    {
        icon: <Truck className="h-8 w-8" />,
        title: "Free Delivery Over $50",
        description: "Enjoy free shipping on all orders above $50. No minimum spend required for local pickup.",
        metric: "2-4 Days Delivery",
    },
    {
        icon: <Wallet className="h-8 w-8" />,
        title: "Cash on Delivery",
        description: "Pay only when you receive your order. Safe, secure, and convenient payment option.",
        metric: "No Advance Payment",
    },
    {
        icon: <Headphones className="h-8 w-8" />,
        title: "24/7 Customer Support",
        description: "Our dedicated support team is available round the clock via phone, email, and live chat.",
        metric: "98% Satisfaction Rate",
    },
    {
        icon: <Clock className="h-8 w-8" />,
        title: "Fast Delivery",
        description: "Quick delivery across all major cities. Track your order in real-time from dispatch to delivery.",
        metric: "2-4 Business Days",
    },
    {
        icon: <RotateCcw className="h-8 w-8" />,
        title: "Easy Returns",
        description: "7-day hassle-free returns. If you're not satisfied, we'll make it right. No questions asked.",
        metric: "100% Money Back",
    },
];

// Counter animation hook
const useCounter = (target: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = target / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.5 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [target, duration, hasAnimated]);

    return { count, countRef };
};

export function TrustIndicators() {
    const customersCount = useCounter(10000);
    const satisfactionCount = useCounter(98);
    const experienceCount = useCounter(5);

    return (
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Why Choose MediGo?</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        We're Committed to Your
                        <span className="text-primary"> Health & Satisfaction</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Trusted by thousands of customers for quality medicines and exceptional service
                    </p>
                </div>

                {/* Trust Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-4">
                            <Users className="h-10 w-10 text-primary" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold mb-2">
                            <span ref={customersCount.countRef}>{customersCount.count}</span>+
                        </div>
                        <p className="text-muted-foreground">Happy Customers</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-4">
                            <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold mb-2">
                            <span ref={satisfactionCount.countRef}>{satisfactionCount.count}</span>%
                        </div>
                        <p className="text-muted-foreground">Customer Satisfaction</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-4">
                            <Award className="h-10 w-10 text-primary" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold mb-2">
                            <span ref={experienceCount.countRef}>{experienceCount.count}</span>+
                        </div>
                        <p className="text-muted-foreground">Years of Trusted Service</p>
                    </div>
                </div>

                {/* Trust Indicators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {indicators.map((indicator, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-2xl bg-card border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Gradient Background on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Icon Container */}
                            <div className="relative">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mb-4">
                                    {indicator.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative">
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {indicator.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    {indicator.description}
                                </p>
                                {indicator.metric && (
                                    <div className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                        <span>{indicator.metric}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust Badge */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="text-sm">Licensed Pharmacy</span>
                        </div>
                        <div className="w-px h-4 bg-border hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="text-sm">ISO Certified</span>
                        </div>
                        <div className="w-px h-4 bg-border hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="text-sm">FDA Approved Products</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}