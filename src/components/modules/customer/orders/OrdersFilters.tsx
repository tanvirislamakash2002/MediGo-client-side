"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface OrdersFiltersProps {
    initialStatus?: string;
    initialSearch?: string;
    initialSort?: string;
}

const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "PLACED", label: "Placed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Amount" },
    { value: "lowest", label: "Lowest Amount" },
];

export function OrdersFilters({ initialStatus = "all", initialSearch = "", initialSort = "newest" }: OrdersFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all" && value !== "newest") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/orders?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters("search", search);
    };

    const clearSearch = () => {
        setSearch("");
        updateFilters("search", "");
    };

    const handleStatusChange = (status: string) => {
        updateFilters("status", status);
    };

    const handleSortChange = (sort: string) => {
        updateFilters("sort", sort);
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-2">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            (initialStatus === option.value || (initialStatus === undefined && option.value === "all"))
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by order ID or medicine name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-8"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                </form>
                
                <select
                    value={initialSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-sm w-full sm:w-auto"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}