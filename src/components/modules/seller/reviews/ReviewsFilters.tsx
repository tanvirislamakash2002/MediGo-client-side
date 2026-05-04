"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { getSellerProducts } from "@/actions/medicine.action";

interface Product {
    id: string;
    name: string;
}

interface ReviewsFiltersProps {
    initialRating?: string;
    initialProductId?: string;
    initialDateRange: string;
    initialResponded?: string;
    initialSearch?: string;
    initialSort: string;
}

export function ReviewsFilters({ 
    initialRating,
    initialProductId,
    initialDateRange,
    initialResponded,
    initialSearch,
    initialSort
}: ReviewsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchValue, setSearchValue] = useState(initialSearch || "");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const result = await getSellerProducts();
            if (result.success) {
                setProducts(result.data?.items || []);
            }
            setIsLoading(false);
        };
        fetchProducts();
    }, []);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/seller/reviews?${params.toString()}`);
    };

    const handleSearch = () => {
        updateFilters("search", searchValue);
    };

    const clearFilters = () => {
        setSearchValue("");
        router.push("/seller/reviews");
    };

    const hasActiveFilters = initialRating || 
        (initialProductId && initialProductId !== "all") || 
        initialDateRange !== "30" ||
        initialResponded || 
        initialSearch ||
        initialSort !== "newest";

    return (
        <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Filters</h3>
            
            {/* Search */}
            <div className="space-y-2">
                <Label className="text-sm">Search Reviews</Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Product or customer..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-8"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSearch}>
                        Go
                    </Button>
                </div>
            </div>
            
            {/* Rating Filter */}
            <div className="space-y-2">
                <Label className="text-sm">Rating</Label>
                <select
                    value={initialRating || "all"}
                    onChange={(e) => updateFilters("rating", e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
            
            {/* Product Filter */}
            <div className="space-y-2">
                <Label className="text-sm">Product</Label>
                <select
                    value={initialProductId || "all"}
                    onChange={(e) => updateFilters("productId", e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                    disabled={isLoading}
                >
                    <option value="all">All Products</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Date Range */}
            <div className="space-y-2">
                <Label className="text-sm">Date Range</Label>
                <select
                    value={initialDateRange}
                    onChange={(e) => updateFilters("dateRange", e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="all">All time</option>
                </select>
            </div>
            
            {/* Response Status */}
            <div className="space-y-2">
                <Label className="text-sm">Response Status</Label>
                <select
                    value={initialResponded || "all"}
                    onChange={(e) => updateFilters("responded", e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="all">All Reviews</option>
                    <option value="true">Responded</option>
                    <option value="false">Not Responded</option>
                </select>
            </div>
            
            {/* Sort */}
            <div className="space-y-2">
                <Label className="text-sm">Sort By</Label>
                <select
                    value={initialSort}
                    onChange={(e) => updateFilters("sort", e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                </select>
            </div>
            
            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full mt-2">
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                </Button>
            )}
        </div>
    );
}