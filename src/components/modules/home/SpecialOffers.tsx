"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
    Clock, 
    Copy, 
    Check, 
    Gift, 
    Zap, 
    Truck, 
    Percent, 
    Tag,
    ArrowRight,
    Sparkles,
    Shield
} from "lucide-react";

interface Offer {
    id: string;
    type: "percentage" | "fixed" | "bogo" | "freeshipping" | "welcome";
    title: string;
    description: string;
    code?: string;
    discount?: number;
    minPurchase?: number;
    expiryDate?: Date;
    category?: string;
    isLimited?: boolean;
    remainingCodes?: number;
}

const offers: Offer[] = [
    {
        id: "1",
        type: "percentage",
        title: "Save 20% on Your First Order",
        description: "Welcome to MediGo! Enjoy a special discount on your first purchase.",
        code: "MEDIGO20",
        discount: 20,
        minPurchase: 20,
        expiryDate: new Date("2026-04-30"),
        isLimited: false,
    },
    {
        id: "2",
        type: "percentage",
        title: "Winter Wellness Sale",
        description: "Boost your immunity with 25% off on all vitamins & supplements",
        code: "WINTER25",
        discount: 25,
        category: "Vitamins",
        expiryDate: new Date("2026-03-15"),
        isLimited: true,
        remainingCodes: 500,
    },
    {
        id: "3",
        type: "freeshipping",
        title: "Free Delivery on All Orders",
        description: "No minimum purchase required. Valid for today only!",
        code: "FREESHIP",
        expiryDate: new Date("2026-02-28"),
        isLimited: true,
        remainingCodes: 1000,
    },
    {
        id: "4",
        type: "percentage",
        title: "Ramadan Special Offer",
        description: "Get 30% off on all digestive health products",
        code: "RAMADAN30",
        discount: 30,
        category: "Digestive Health",
        expiryDate: new Date("2026-04-10"),
        isLimited: false,
    },
];

// Countdown Timer Component
function CountdownTimer({ expiryDate }: { expiryDate: Date }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = expiryDate.getTime() - now;

            if (distance < 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    const totalSeconds = timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;

    if (totalSeconds <= 0) return null;

    return (
        <div className="flex items-center gap-2 text-center">
            <div className="bg-black/20 rounded-lg px-2 py-1 min-w-[40px]">
                <span className="text-lg font-bold">{timeLeft.days}</span>
                <span className="text-xs ml-1">d</span>
            </div>
            <span className="text-lg font-bold">:</span>
            <div className="bg-black/20 rounded-lg px-2 py-1 min-w-[40px]">
                <span className="text-lg font-bold">{timeLeft.hours.toString().padStart(2, "0")}</span>
                <span className="text-xs ml-1">h</span>
            </div>
            <span className="text-lg font-bold">:</span>
            <div className="bg-black/20 rounded-lg px-2 py-1 min-w-[40px]">
                <span className="text-lg font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</span>
                <span className="text-xs ml-1">m</span>
            </div>
            <span className="text-lg font-bold">:</span>
            <div className="bg-black/20 rounded-lg px-2 py-1 min-w-[40px]">
                <span className="text-lg font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</span>
                <span className="text-xs ml-1">s</span>
            </div>
        </div>
    );
}

// Individual Banner Component
function OfferBanner({ offer, index }: { offer: Offer; index: number }) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCopyCode = () => {
        if (offer.code) {
            navigator.clipboard.writeText(offer.code);
            setCopied(true);
            toast.success("Coupon code copied!", {
                description: `Use ${offer.code} at checkout`,
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShopNow = () => {
        if (offer.category) {
            router.push(`/shop?category=${encodeURIComponent(offer.category)}`);
        } else {
            router.push("/shop");
        }
    };

    const getGradient = () => {
        const gradients = [
            "from-orange-500 to-red-600",
            "from-purple-500 to-pink-600",
            "from-green-500 to-teal-600",
            "from-blue-500 to-indigo-600",
        ];
        return gradients[index % gradients.length];
    };

    const getIcon = () => {
        switch (offer.type) {
            case "percentage":
                return <Percent className="h-6 w-6" />;
            case "freeshipping":
                return <Truck className="h-6 w-6" />;
            case "welcome":
                return <Gift className="h-6 w-6" />;
            default:
                return <Tag className="h-6 w-6" />;
        }
    };

    const getBadge = () => {
        if (offer.type === "freeshipping") return "Free Shipping";
        if (offer.type === "welcome") return "Welcome Offer";
        if (offer.isLimited) return "Limited Time";
        return "Special Offer";
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${getGradient()} text-white shadow-lg transition-all duration-500 ${
                isHovered ? "scale-[1.02] shadow-xl" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="absolute top-0 right-0 h-full w-1/2" viewBox="0 0 100 100" fill="none">
                    <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="currentColor" />
                    <circle cx="80" cy="20" r="30" fill="currentColor" />
                    <circle cx="20" cy="80" r="40" fill="currentColor" />
                </svg>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 animate-float-slow opacity-20">
                <Sparkles className="h-12 w-12" />
            </div>
            <div className="absolute bottom-10 right-10 animate-float-fast opacity-20">
                <Zap className="h-12 w-12" />
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left Side - Offer Details */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                                {getBadge()}
                            </Badge>
                            {offer.isLimited && offer.remainingCodes && (
                                <Badge variant="secondary" className="bg-yellow-500 text-black border-0">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Only {offer.remainingCodes} left
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            {getIcon()}
                            <h3 className="text-2xl md:text-3xl font-bold">{offer.title}</h3>
                        </div>

                        <p className="text-white/90 mb-4 max-w-lg">{offer.description}</p>

                        {offer.minPurchase && (
                            <p className="text-sm text-white/80 mb-3">
                                ✓ Min. purchase: ${offer.minPurchase}
                            </p>
                        )}

                        {offer.expiryDate && (
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-4 w-4 text-white/80" />
                                <CountdownTimer expiryDate={offer.expiryDate} />
                            </div>
                        )}
                    </div>

                    {/* Right Side - Coupon Code & CTA */}
                    <div className="flex flex-col items-center gap-4 min-w-[200px]">
                        {offer.code && (
                            <div className="w-full">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-1">
                                    <div className="flex-1 text-center font-mono text-lg font-bold tracking-wider">
                                        {offer.code}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleCopyCode}
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-white/70 text-center mt-2">
                                    Copy code at checkout
                                </p>
                            </div>
                        )}

                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={handleShopNow}
                            className="w-full gap-2 group bg-white text-gray-900 hover:bg-white/90"
                        >
                            Shop Now
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Terms Link */}
                <div className="mt-4 text-center text-xs text-white/60">
                    <a href="/terms" className="hover:text-white transition-colors">
                        Terms and conditions apply
                    </a>
                </div>
            </div>
        </div>
    );
}

// Carousel Component for Multiple Offers
function OfferCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <div
                    className="transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    <div className="flex">
                        {offers.map((offer, index) => (
                            <div key={offer.id} className="w-full flex-shrink-0 px-4">
                                <OfferBanner offer={offer} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {offers.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all ${
                            currentIndex === index ? "bg-primary w-6" : "bg-muted-foreground/30"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export function SpecialOffers() {
    return (
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Limited Time Offers</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Special <span className="text-primary">Discounts</span> & Offers
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Don't miss out on these amazing deals! Grab your favorites before they're gone.
                    </p>
                </div>

                {/* Offers Display */}
                <OfferCarousel />
            </div>
        </section>
    );
}