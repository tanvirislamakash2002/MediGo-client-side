"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

interface WishlistHeaderProps {
    totalItems: number;
}

export function WishlistHeader({ totalItems }: WishlistHeaderProps) {
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-pink-500" />
                        <h1 className="text-2xl font-bold">My Wishlist</h1>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        You have {totalItems} {totalItems === 1 ? "item" : "items"} saved in your wishlist
                    </p>
                </div>
                
            </div>
        </div>
    );
}