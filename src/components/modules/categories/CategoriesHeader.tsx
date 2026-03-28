"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3 } from "lucide-react";
import { useState } from "react";

interface CategoriesHeaderProps {
    searchQuery?: string;
}

export function CategoriesHeader({ searchQuery = "" }: CategoriesHeaderProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/categories?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                <Grid3x3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Shop by Category</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Medicine <span className="text-primary">Categories</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Browse medicines by health needs and conditions. Find exactly what you're looking for.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </form>
        </div>
    );
}