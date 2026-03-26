"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface OrdersFiltersProps {
    initialStatus?: string;
    initialSearch?: string;
    initialSort?: string;
    initialFromDate?: string;
    initialToDate?: string;
}

const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "PLACED", label: "Pending (Placed)" },
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

export function OrdersFilters({ 
    initialStatus = "all", 
    initialSearch = "", 
    initialSort = "newest",
    initialFromDate = "",
    initialToDate = ""
}: OrdersFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);
    const [fromDate, setFromDate] = useState<Date | undefined>(
        initialFromDate ? new Date(initialFromDate) : undefined
    );
    const [toDate, setToDate] = useState<Date | undefined>(
        initialToDate ? new Date(initialToDate) : undefined
    );

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all" && value !== "newest") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/admin/orders?${params.toString()}`);
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

    const handleDateRange = () => {
        if (fromDate) updateFilters("fromDate", format(fromDate, "yyyy-MM-dd"));
        if (toDate) updateFilters("toDate", format(toDate, "yyyy-MM-dd"));
    };

    const clearDateRange = () => {
        setFromDate(undefined);
        setToDate(undefined);
        updateFilters("fromDate", "");
        updateFilters("toDate", "");
    };

    return (
        <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1 border-b pb-2">
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
            
            {/* Search, Sort, and Date Range */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by order ID, customer name, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-8"
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
                
                <div className="flex gap-2">
                    {/* Date Range Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                {fromDate || toDate ? (
                                    <span className="text-xs">
                                        {fromDate && format(fromDate, "MMM d")}
                                        {fromDate && toDate && " - "}
                                        {toDate && format(toDate, "MMM d")}
                                    </span>
                                ) : (
                                    "Date Range"
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <div className="p-3 border-b">
                                <p className="text-sm font-medium">Select Date Range</p>
                            </div>
                            <div className="p-3">
                                <CalendarComponent
                                    mode="range"
                                    selected={{ from: fromDate, to: toDate }}
                                    onSelect={(range) => {
                                        setFromDate(range?.from);
                                        setToDate(range?.to);
                                    }}
                                    numberOfMonths={2}
                                />
                            </div>
                            <div className="flex gap-2 p-3 border-t">
                                <Button size="sm" onClick={handleDateRange}>Apply</Button>
                                <Button size="sm" variant="ghost" onClick={clearDateRange}>Clear</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    
                    {/* Sort Dropdown */}
                    <select
                        value={initialSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-3 py-1.5 border rounded-md bg-background text-sm"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}