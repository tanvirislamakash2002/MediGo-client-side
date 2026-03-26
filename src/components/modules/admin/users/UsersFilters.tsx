"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface UsersFiltersProps {
    initialRole?: string;
    initialStatus?: string;
    initialVerified?: string;
    initialSearch?: string;
    initialSort?: string;
}

const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "CUSTOMER", label: "Customers" },
    { value: "SELLER", label: "Sellers" },
    { value: "ADMIN", label: "Admins" },
];

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
];

const verifiedOptions = [
    { value: "all", label: "All" },
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
];

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name_asc", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "orders", label: "Most Orders" },
];

export function UsersFilters({ 
    initialRole = "all", 
    initialStatus = "all",
    initialVerified = "all",
    initialSearch = "", 
    initialSort = "newest"
}: UsersFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);
    const [role, setRole] = useState(initialRole);
    const [status, setStatus] = useState(initialStatus);
    const [verified, setVerified] = useState(initialVerified);
    const [sort, setSort] = useState(initialSort);

    const updateFilters = () => {
        const params = new URLSearchParams();
        
        if (role && role !== "all") params.set("role", role);
        if (status && status !== "all") params.set("status", status);
        if (verified && verified !== "all") params.set("verified", verified);
        if (search) params.set("search", search);
        if (sort && sort !== "newest") params.set("sort", sort);
        params.set("page", "1");
        
        router.push(`/admin/users?${params.toString()}`);
    };

    const resetFilters = () => {
        setRole("all");
        setStatus("all");
        setVerified("all");
        setSearch("");
        setSort("newest");
        router.push("/admin/users");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters();
    };

    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                </form>
                
                <div className="flex gap-2">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-3 py-1.5 text-sm border rounded-md bg-background"
                    >
                        {roleOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-1.5 text-sm border rounded-md bg-background"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={verified}
                        onChange={(e) => setVerified(e.target.value)}
                        className="px-3 py-1.5 text-sm border rounded-md bg-background"
                    >
                        {verifiedOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-3 py-1.5 text-sm border rounded-md bg-background"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    
                    <Button variant="outline" size="sm" onClick={updateFilters}>
                        Apply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}