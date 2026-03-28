"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    Droplet,
    Thermometer,
    Wind,
    Stethoscope,
    Bandage,
    Pill,
    ChevronRight,
    Package,
    Star,
    Grid3x3,
    List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    medicineCount?: number;
}

interface CategoryGridProps {
    categories: Category[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Category icon mapping based on name
const getCategoryIconComponent = (categoryName: string) => {
    const iconMap: Record<string, any> = {
        "Pain Relief": Activity,
        "Vitamins": Droplet,
        "Cold": Thermometer,
        "Allergy": Wind,
        "Digestive": Stethoscope,
        "First Aid": Bandage,
    };
    for (const [key, Icon] of Object.entries(iconMap)) {
        if (categoryName.includes(key)) {
            return Icon;
        }
    }
    return Pill;
};

// Category color mapping based on name
const getCategoryColor = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
        "Pain Relief": "bg-blue-500/10 text-blue-500",
        "Vitamins": "bg-green-500/10 text-green-500",
        "Cold": "bg-orange-500/10 text-orange-500",
        "Allergy": "bg-purple-500/10 text-purple-500",
        "Digestive": "bg-yellow-500/10 text-yellow-500",
        "First Aid": "bg-red-500/10 text-red-500",
        "Diabetes": "bg-teal-500/10 text-teal-500",
        "Baby": "bg-pink-500/10 text-pink-500",
    };

    for (const [key, color] of Object.entries(colorMap)) {
        if (categoryName.includes(key)) {
            return color;
        }
    }
    return "bg-primary/10 text-primary";
};


export function CategoryGrid({ categories, pagination }: CategoryGridProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleCategoryClick = (category: Category) => {
        router.push(`/shop?categoryName=${encodeURIComponent(category.name)}`);
    };

    // Featured categories (first 3)
    const featuredCategories = categories.slice(0, 3);

    return (
        <div className="space-y-12">
            {/* View Toggle Bar */}
            <div className="flex justify-end">
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="gap-1"
                    >
                        <Grid3x3 className="h-4 w-4" />
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="gap-1"
                    >
                        <List className="h-4 w-4" />
                        List
                    </Button>
                </div>
            </div>

            {/* Featured Categories Section */}
            {featuredCategories.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <h2 className="text-2xl font-semibold">Featured Categories</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredCategories.map((category) => {
                            const iconColor = getCategoryColor(category.name);
                            const IconComponent = getCategoryIconComponent(category.name);

                            return (
                                <div
                                    key={category.id}
                                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 cursor-pointer group"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center`}>
                                                <IconComponent className={`h-7 w-7 ${iconColor.split(" ")[1]}`} />
                                            </div>
                                            <Badge variant="secondary">
                                                {category.medicineCount || 0} products
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                            {category.description || "Browse our selection of medicines"}
                                        </p>
                                        <Button variant="ghost" className="gap-2 p-0 hover:bg-transparent group-hover:gap-3 transition-all">
                                            Shop Now
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* All Categories */}
            <div>
                <h2 className="text-2xl font-semibold mb-6">
                    All Categories
                    <span className="text-sm text-muted-foreground ml-2">
                        ({categories.length} total)
                    </span>
                </h2>

                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No categories found</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => {
                            const iconColor = getCategoryColor(category.name);
    const IconComponent = getCategoryIconComponent(category.name);

                            return (
                                <Card
                                    key={category.id}
                                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div className="p-6">
                                        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <IconComponent className={`h-7 w-7 ${iconColor.split(" ")[1]}`} />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {category.description || "Browse our selection of medicines"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {category.medicineCount || 0} products
                                            </span>
                                            <Button variant="ghost" size="sm" className="gap-1">
                                                Shop
                                                <ChevronRight className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {categories.map((category) => {
                            const iconColor = getCategoryColor(category.name);
    const IconComponent = getCategoryIconComponent(category.name);

                            return (
                                <Card
                                    key={category.id}
                                    className="group cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div className="p-4 flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
                                                <IconComponent className={`h-7 w-7 ${iconColor.split(" ")[1]}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                                                    {category.description || "Browse our selection of medicines"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">
                                                {category.medicineCount || 0} products
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => {
                            const params = new URLSearchParams(window.location.search);
                            params.set("page", (pagination.page - 1).toString());
                            router.push(`/categories?${params.toString()}`);
                        }}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => {
                            const params = new URLSearchParams(window.location.search);
                            params.set("page", (pagination.page + 1).toString());
                            router.push(`/categories?${params.toString()}`);
                        }}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}