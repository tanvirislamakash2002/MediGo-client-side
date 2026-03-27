"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
    sellerName: string;
    storeName: string;
}

const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
];

export function DashboardHeader({ sellerName, storeName }: DashboardHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRange = searchParams.get("range") || "week";
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRangeChange = (range: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("range", range);
        router.push(`/seller/dashboard?${params.toString()}`);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const getRangeLabel = () => {
        const range = dateRanges.find(r => r.value === currentRange);
        return range?.label || "This Week";
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back, <span className="font-medium text-foreground">{sellerName}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                        {storeName}
                    </Badge>
                    <Badge variant="default" className="bg-green-500 text-xs">
                        Active
                    </Badge>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            {getRangeLabel()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {dateRanges.map((range) => (
                            <DropdownMenuItem
                                key={range.value}
                                onClick={() => handleRangeChange(range.value)}
                                className={currentRange === range.value ? "bg-muted" : ""}
                            >
                                {range.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>
        </div>
    );
}