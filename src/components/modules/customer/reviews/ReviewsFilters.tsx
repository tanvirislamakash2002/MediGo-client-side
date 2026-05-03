"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ReviewsFiltersProps {
    initialSort: string;
    initialRating?: string;
    initialSearch?: string;
}

export function ReviewsFilters({ initialSort, initialRating, initialSearch }: ReviewsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(initialSearch || "");

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/reviews?${params.toString()}`);
    };

    const handleSearch = () => {
        if (searchValue) {
            updateFilters("search", searchValue);
        } else {
            updateFilters("search", "");
        }
    };

    const clearFilters = () => {
        setSearchValue("");
        router.push("/reviews");
    };

    const hasActiveFilters = initialSort !== "newest" || initialRating || initialSearch;

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Filters</h3>
            
            {/* Search */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Search Reviews</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by medicine name..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-8"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </div>
            
            {/* Sort */}
            <div className="mt-4 space-y-2">
                <label className="text-sm font-medium">Sort By</label>
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
            
            {/* Rating Filter */}
            <div className="mt-4 space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="space-y-1">
                    {["all", "5", "4", "3", "2", "1"].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                value={rating}
                                checked={initialRating === rating || (rating === "all" && !initialRating)}
                                onChange={() => updateFilters("rating", rating === "all" ? "" : rating)}
                                className="h-3 w-3"
                            />
                            {rating === "all" ? "All Ratings" : `${rating} Stars`}
                        </label>
                    ))}
                </div>
            </div>
            
            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full mt-4">
                    <X className="h-3 w-3 mr-1" />
                    Clear Filters
                </Button>
            )}
        </div>
    );
}