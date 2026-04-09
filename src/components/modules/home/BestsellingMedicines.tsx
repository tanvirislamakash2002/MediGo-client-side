"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Star, ShoppingCart, Heart, Eye, Loader2, Check } from "lucide-react";
import { Medicine } from "@/types";


// Skeleton loader for products
function ProductSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
                <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-9 w-full" />
            </CardContent>
        </Card>
    );
}

// Rating Stars Component
function RatingStars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-3 w-3 ${i < fullStars
                            ? "fill-yellow-500 text-yellow-500"
                            : i === fullStars && hasHalfStar
                                ? "fill-yellow-500 text-yellow-500 half-star"
                                : "text-muted-foreground"
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
    );
}

// Product Card Component
function ProductCard({ product }: { product: Medicine }) {
    const router = useRouter();
    const { addToCart, isLoading: cartLoading } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [imageError, setImageError] = useState(false);

    const stockStatus = product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock";
    const stockColor = product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-600" : "text-red-600";
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isOutOfStock) return;

        setIsAddingToCart(true);
        try {
            await addToCart(product.id as string, 1);
            setAddedToCart(true);
            toast.success(`${product.name} added to cart`);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Implement quick view modal
        router.push(`/shop/${product.id}`);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Added to wishlist");
    };
    return (
        <Card
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/shop/${product.id}`)}
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-muted/20">
                {/* {product.isBestseller && (
                    <Badge className="absolute top-2 left-2 z-10 bg-orange-500 hover:bg-orange-600">
                        Bestseller
                    </Badge>
                )}
                {product.discount && (
                    <Badge className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600">
                        -{product.discount}%
                    </Badge>
                )} */}
                <div className="relative h-full w-full overflow-hidden">
                    {!imageError ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
                            <span className="text-muted-foreground">No image</span>
                        </div>
                    )}
                </div>

                {/* Quick Action Buttons (on hover) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={handleQuickView}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                        onClick={handleWishlist}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <CardContent className="p-4 space-y-2">
                <div>
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{product.manufacturer}</p>
                </div>

                {/* <RatingStars rating={product.rating} reviewCount={product.reviewCount} /> */}

                {/* Pricing */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    {product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                            ${parseInt(product.price.toFixed(2)) + 4}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${stockColor}`} />
                        <span className={`text-xs ${stockColor}`}>{stockStatus}</span>
                    </div>
                    {product.requiresPrescription && (
                        <Badge variant="outline" className="text-xs">
                            Rx Required
                        </Badge>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Button
                    className="w-full gap-2"
                    variant={isOutOfStock ? "outline" : "default"}
                    disabled={isOutOfStock || isAddingToCart}
                    onClick={handleAddToCart}
                >
                    {isAddingToCart ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : addedToCart ? (
                        <>
                            <Check className="h-4 w-4" />
                            Added
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4" />
                            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

export function BestsellingMedicines({ medicineData }: { medicineData: Medicine[] }) {
    const [products, setProducts] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useState(() => {
        setProducts(medicineData);
        setLoading(false);
    });

    if (error) {
        return (
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500">Failed to load products. Please try again later.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="text-primary">Bestselling</span> Medicines
                        </h2>
                        <p className="text-muted-foreground">
                            Trusted by thousands of customers. Shop our most popular products.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        className="mt-4 md:mt-0 gap-2"
                        onClick={() => window.location.href = "/shop?sort=bestselling"}
                    >
                        View All
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}