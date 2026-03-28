"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    productCount: number;
    slug: string;
}

const categories: Category[] = [
    {
        id: "pain-relief",
        name: "Pain Relief",
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        ),
        description: "Headaches, back pain, muscle aches",
        productCount: 245,
        slug: "Pain Relief",
    },
    {
        id: "vitamins",
        name: "Vitamins & Supplements",
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
            </svg>
        ),
        description: "Boost immunity, daily nutrition",
        productCount: 189,
        slug: "Vitamins",
    },
    {
        id: "cold-flu",
        name: "Cold & Flu",
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        description: "Fever, cough, sore throat relief",
        productCount: 167,
        slug: "Cold",
    },
    {
        id: "allergy",
        name: "Allergy & Sinus",
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a5 5 0 0 0-5 5c0 2 1 5 5 5s5-3 5-5-2.24-5-5-5z" />
                <path d="M12 12v8" />
                <path d="M9 20h6" />
            </svg>
        ),
        description: "Seasonal allergies, sinus pressure",
        productCount: 98,
        slug: "Allergy",
    },
    {
        id: "digestive",
        name: "Digestive Health",
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4 12h4M16 12h4" />
                <circle cx="12" cy="12" r="8" />
                <path d="M9 12h6" />
            </svg>
        ),
        description: "Indigestion, acidity, probiotics",
        productCount: 134,
        slug: "Digestive",
    },
    {
        id: "first-aid",
        name: "First Aid",
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 8v8M8 12h8" />
                <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
        ),
        description: "Wound care, antiseptics, bandages",
        productCount: 76,
        slug: "First Aid",
    },
];

export function FeaturedCategories() {
    const router = useRouter();

    const handleCategoryClick = (category: Category) => {
        router.push(`/shop?categoryName=${encodeURIComponent(category.slug)}`);
    };

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Shop by <span className="text-primary">Category</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Browse medicines by health needs and find what you're looking for quickly
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative bg-card rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                            onClick={() => handleCategoryClick(category)}
                        >
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="p-6">
                                {/* Icon Container */}
                                <div className="mb-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        {category.icon}
                                    </div>
                                </div>

                                {/* Category Info */}
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {category.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {category.productCount} products
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 group-hover:gap-2 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCategoryClick(category);
                                        }}
                                    >
                                        Shop Now
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Categories Link */}
                <div className="text-center mt-12">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => router.push("/shop?view=categories")}
                        className="gap-2"
                    >
                        View All Categories
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}