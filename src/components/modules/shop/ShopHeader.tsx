"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ShopHeaderProps {
    totalResults: number;
    initialSortBy: string;
    initialSortOrder: string;
    initialLimit: number;
}

export function ShopHeader({ totalResults, initialSortBy, initialSortOrder, initialLimit }: ShopHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || "";

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set('search', value);
        else params.delete('search');
        params.set('page', '1');
        router.push(`/shop?${params.toString()}`);
    };

    const handleSort = (value: string) => {
        const [sortBy, sortOrder] = value.split('-');
        const params = new URLSearchParams(searchParams);
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);
        router.push(`/shop?${params.toString()}`);
    };

    const handleLimit = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('limit', value);
        params.set('page', '1');
        router.push(`/shop?${params.toString()}`);
    };

    const sortValue = `${initialSortBy}-${initialSortOrder}`;

    return (
        <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, manufacturer, or category..."
                    defaultValue={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results Info & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    {totalResults} {totalResults === 1 ? 'medicine' : 'medicines'} found
                </p>
                
                <div className="flex gap-3">
                    <Select value={sortValue} onValueChange={handleSort}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt-desc">Newest First</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="name-asc">Name: A to Z</SelectItem>
                            <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={initialLimit.toString()} onValueChange={handleLimit}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Show" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="12">12 per page</SelectItem>
                            <SelectItem value="24">24 per page</SelectItem>
                            <SelectItem value="48">48 per page</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}