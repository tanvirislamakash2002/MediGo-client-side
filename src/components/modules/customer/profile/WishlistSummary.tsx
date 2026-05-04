"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface WishlistItem {
    id: string;
    medicineId: string;
    addedAt: string;
    medicine: {
        id: string;
        name: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        requiresPrescription: boolean;
        category: { id: string; name: string };
    };
}

interface WishlistSummaryProps {
    wishlist: WishlistItem[];
}

export function WishlistSummary({ wishlist }: WishlistSummaryProps) {
    const items = Array.isArray(wishlist) ? wishlist : (wishlist as any)?.items || [];
    const recentItems = items.slice(0, 2);
    const totalItems = items.length;
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Wishlist</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/wishlist">View All →</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {totalItems > 0 ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                            <span>{totalItems} items saved</span>
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </div>
                        {recentItems.map((item: WishlistItem) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                                    {item.medicine?.imageUrl ? (
                                        <Image
                                            src={item.medicine.imageUrl}
                                            alt={item.medicine.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Heart className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium line-clamp-1">{item.medicine?.name}</p>
                                    <p className="text-xs text-muted-foreground">${item.medicine?.price}</p>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/shop/${item.medicineId}`}>View</Link>
                                </Button>
                            </div>
                        ))}
                        {wishlist.length > 2 && (
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                +{wishlist.length - 2} more items
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Your wishlist is empty</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Save items you love to your wishlist
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                            <Link href="/shop">Browse Products</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}