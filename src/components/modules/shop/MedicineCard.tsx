"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart, Loader2, Pill } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { checkInWishlist } from "@/actions/wishlist.action";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
    category: { id: string; name: string };
}

interface MedicineCardProps {
    medicine: Medicine;
    onViewDetails: () => void;
}

export function MedicineCard({ medicine, onViewDetails }: MedicineCardProps) {
    const [inWishlist, setInWishlist] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const { addToCart, isAdding } = useCart();
    const { toggleWishlist } = useWishlist();

    // Check if item is in wishlist on mount
    useEffect(() => {
        const checkStatus = async () => {
            const result = await checkInWishlist(medicine.id);
            if (result.success) {
                setInWishlist(result.data?.inWishlist || false);
            }
        };
        checkStatus();
    }, [medicine.id]);

    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    const getStockBadge = () => {
        if (medicine.stock <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (medicine.stock < 10) return <Badge variant="secondary">Low Stock: {medicine.stock}</Badge>;
        return <Badge variant="default">In Stock</Badge>;
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await addToCart(medicine.id, 1);
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsWishlistLoading(true);
        const success = await toggleWishlist(medicine.id, inWishlist);
        if (success) {
            setInWishlist(!inWishlist);
        }
        setIsWishlistLoading(false);
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onViewDetails}>
            <div className="relative h-48 bg-muted">
                {isValidUrl(medicine.imageUrl) ? (
                    <Image
                        src={medicine.imageUrl!}
                        alt={medicine.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-4xl text-muted-foreground">
                        <Pill size={45} />
                    </div>
                )}
                
                {/* Rx Badge - Top Left */}
                {medicine.requiresPrescription && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                        Rx Required
                    </Badge>
                )}
                
                {/* Wishlist Button - Top Right */}
                <button
                    onClick={handleToggleWishlist}
                    className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition-transform z-10"
                    disabled={isWishlistLoading}
                >
                    {isWishlistLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    ) : (
                        <Heart 
                            className={`h-5 w-5 transition-colors ${
                                inWishlist 
                                    ? "fill-red-500 text-red-500" 
                                    : "text-gray-600 dark:text-gray-300 hover:text-red-500"
                            }`} 
                        />
                    )}
                </button>
            </div>

            <CardHeader>
                <div>
                    <CardTitle className="text-lg line-clamp-1">{medicine.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{medicine.manufacturer}</p>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {medicine.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                        ${medicine.price.toFixed(2)}
                    </span>
                    {getStockBadge()}
                </div>
            </CardContent>

            <CardFooter className="gap-2">
                <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={medicine.stock <= 0 || isAdding}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon" onClick={onViewDetails}>
                    <Eye className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}