"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

interface WishlistFiltersProps {
    initialSort: string;
    initialInStockFilter: boolean;
}

export function WishlistFilters({ initialSort, initialInStockFilter }: WishlistFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/wishlist?${params.toString()}`);
    };

    const handleSort = (value: string) => {
        updateFilters("sort", value);
    };

    const handleInStockToggle = (checked: boolean) => {
        updateFilters("inStock", checked ? "true" : "");
    };

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        router.push("/wishlist");
    };

    const handlePriceFilter = () => {
        if (minPrice || maxPrice) {
            const params = new URLSearchParams(searchParams);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);
            router.push(`/wishlist?${params.toString()}`);
        }
    };

    const hasActiveFilters = initialSort !== "newest" || initialInStockFilter || minPrice || maxPrice;

    return (
        <div className="space-y-6">
            <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Sort By</h3>
                <div className="space-y-2">
                    {[
                        { value: "newest", label: "Newest First" },
                        { value: "oldest", label: "Oldest First" },
                        { value: "price_asc", label: "Price: Low to High" },
                        { value: "price_desc", label: "Price: High to Low" },
                        { value: "name_asc", label: "Name: A to Z" },
                    ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="sort"
                                value={option.value}
                                checked={initialSort === option.value}
                                onChange={() => handleSort(option.value)}
                                className="h-3 w-3"
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Filter</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={initialInStockFilter}
                            onChange={(e) => handleInStockToggle(e.target.checked)}
                            className="h-3 w-3"
                        />
                        <span className="text-sm">In Stock Only</span>
                    </label>
                </div>
            </div>

            <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="h-9"
                        />
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <Button size="sm" variant="outline" onClick={handlePriceFilter} className="w-full">
                        Apply Price Filter
                    </Button>
                </div>
            </div>

            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                    <X className="h-3 w-3 mr-1" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );
}