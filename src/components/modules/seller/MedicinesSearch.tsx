"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface MedicinesSearchProps {
    initialSearch: string;
    initialLimit: number;
}

export function MedicinesSearch({ initialSearch, initialLimit }: MedicinesSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);
    const [limit, setLimit] = useState(initialLimit.toString());

    // Update URL when search changes
    const handleSearch = (value: string) => {
        setSearch(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/seller/medicines?${params.toString()}`);
    };

    // Update URL when limit changes
    const handleLimitChange = (value: string) => {
        setLimit(value);
        const params = new URLSearchParams(searchParams);
        if (value !== '9') {
            params.set('limit', value);
        } else {
            params.delete('limit');
        }
        params.set('page', '1');
        router.push(`/seller/medicines?${params.toString()}`);
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Label htmlFor="search">Search Medicines</Label>
                        <Input
                            id="search"
                            placeholder="Search by name, manufacturer, or category..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div className="w-32">
                        <Label htmlFor="limit">Items per page</Label>
                        <Select value={limit} onValueChange={handleLimitChange}>
                            <SelectTrigger id="limit" className="mt-1">
                                <SelectValue placeholder="Select limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="18">18</SelectItem>
                                <SelectItem value="24">24</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}