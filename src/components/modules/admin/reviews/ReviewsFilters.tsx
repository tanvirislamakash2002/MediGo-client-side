"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { getAllSellers } from "@/actions/user.action";

interface Seller {
    id: string;
    storeName: string;
}

interface ReviewsFiltersProps {
    initialStatus?: string;
    initialRating?: string;
    initialDateRange?: string;
    initialSellerId?: string;
    initialSearch?: string;
    initialSort: string;
}

export function ReviewsFilters({
    initialStatus,
    initialRating,
    initialDateRange,
    initialSellerId,
    initialSearch,
    initialSort
}: ReviewsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [searchValue, setSearchValue] = useState(initialSearch || "");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            const result = await getAllSellers();
            if (result.success && 'data' in result && result.data) {
                const data = result.data as { users: Seller[] };
                setSellers(data.users || []);
            } else {
                setSellers([]);
            }
            setIsLoading(false);
        };
        fetchSellers();
    }, []);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/admin/reviews?${params.toString()}`);
    };

    const handleSearch = () => {
        updateFilters("search", searchValue);
    };

    const clearFilters = () => {
        setSearchValue("");
        router.push("/admin/reviews");
    };

    const hasActiveFilters = (initialStatus && initialStatus !== "all") ||
        (initialRating && initialRating !== "all") ||
        (initialDateRange && initialDateRange !== "all") ||
        (initialSellerId && initialSellerId !== "all") ||
        initialSearch ||
        initialSort !== "newest";

    return (
        <div className="border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                {/* Search */}
                <div className="flex gap-2 md:col-span-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reviews..."
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

                {/* Status Filter */}
                <select
                    value={initialStatus || "all"}
                    onChange={(e) => updateFilters("status", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="all">All Status</option>
                    <option value="APPROVED">Approved</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>

                {/* Rating Filter */}
                <select
                    value={initialRating || "all"}
                    onChange={(e) => updateFilters("rating", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>

                {/* Date Range Filter */}
                <select
                    value={initialDateRange || "all"}
                    onChange={(e) => updateFilters("dateRange", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-md bg-background"
                >
                    <option value="all">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                </select>

                {/* Seller Filter */}
                <select
                    value={initialSellerId || "all"}
                    onChange={(e) => updateFilters("sellerId", e.target.value)}
                    className="px-3 py-2 text-sm border rounded-md bg-background"
                    disabled={isLoading}
                >
                    <option value="all">All Sellers</option>
                    {sellers.map((seller) => (
                        <option key={seller.id} value={seller.id}>
                            {seller.storeName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <div className="mt-3 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-3 w-3 mr-1" />
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}