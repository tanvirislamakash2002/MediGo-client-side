"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WishlistItemCard } from "./WishlistItemCard";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { getWishlist, addToWishlist } from "@/actions/wishlist.action";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

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

interface WishlistItemsProps {
    initialItems: WishlistItem[];
    initialPage: number;
    initialSort: string;
    initialInStockFilter: boolean;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export function WishlistItems({
    initialItems,
    initialPage,
    initialSort,
    initialInStockFilter,
    pagination: initialPagination
}: WishlistItemsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [items, setItems] = useState<WishlistItem[]>(initialItems);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const { addToCart } = useCart();

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            const inStock = searchParams.get("inStock") === "true";
            const minPrice = searchParams.get("minPrice");
            const maxPrice = searchParams.get("maxPrice");

            const result = await getWishlist(page, 12);
            if (result.success) {
                let filteredItems: WishlistItem[] = result.data?.items || [];

                // Apply in-stock filter
                if (inStock) {
                    filteredItems = filteredItems.filter(item => (item.medicine?.stock || 0) > 0);
                }

                // Apply price filter
                if (minPrice) {
                    filteredItems = filteredItems.filter(item => (item.medicine?.price || 0) >= parseFloat(minPrice));
                }
                if (maxPrice) {
                    filteredItems = filteredItems.filter(item => (item.medicine?.price || 0) <= parseFloat(maxPrice));
                }

                // Apply sort
                switch (sort) {
                    case "price_asc":
                        filteredItems.sort((a, b) => (a.medicine?.price || 0) - (b.medicine?.price || 0));
                        break;
                    case "price_desc":
                        filteredItems.sort((a, b) => (b.medicine?.price || 0) - (a.medicine?.price || 0));
                        break;
                    case "name_asc":
                        filteredItems.sort((a, b) => (a.medicine?.name || "").localeCompare(b.medicine?.name || ""));
                        break;
                    case "oldest":
                        filteredItems.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
                        break;
                    default: // newest
                        filteredItems.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
                }

                setItems(filteredItems);
                setPagination({
                    ...result.data?.pagination,
                    total: filteredItems.length,
                    totalPages: Math.ceil(filteredItems.length / 12)
                });
            }
            setIsLoading(false);
        };

        fetchItems();
    }, [searchParams, initialSort, initialInStockFilter]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/wishlist?${params.toString()}`);
    };

    const handleRemoveItem = (itemId: string) => {
        setItems(items.filter(i => i.id !== itemId));
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
    };

    const handleSelectItem = (itemId: string, checked: boolean) => {
        const newSet = new Set(selectedItems);
        if (checked) {
            newSet.add(itemId);
        } else {
            newSet.delete(itemId);
        }
        setSelectedItems(newSet);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(new Set(items.map(i => i.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleAddSelectedToCart = async () => {
        const selectedItemsList = items.filter(i => selectedItems.has(i.id));
        let successCount = 0;

        for (const item of selectedItemsList) {
            if ((item.medicine?.stock || 0) > 0) {
                const success = await addToCart(item.medicine.id, 1);
                if (success) successCount++;
            }
        }

        if (successCount > 0) {
            toast.success(`Added ${successCount} items to cart`);
            setSelectedItems(new Set());
        } else {
            toast.error("No items could be added to cart");
        }
    };

    if (isLoading && items.length === 0) {
        return <WishlistSkeleton />;
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <div className="flex justify-center mb-4">
                    <Heart className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-4">
                    Save items you love by clicking the heart icon
                </p>
                <Button onClick={() => router.push("/shop")}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Bulk Actions Bar */}
            {items.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedItems.size === items.length && items.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">
                            Select All ({selectedItems.size} of {items.length})
                        </span>
                    </div>
                    {selectedItems.size > 0 && (
                        <Button
                            size="sm"
                            onClick={handleAddSelectedToCart}
                            variant="outline"
                        >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add Selected to Cart
                        </Button>
                    )}
                </div>
            )}

            {/* Wishlist Items Grid */}
            <div className="space-y-4">
                {items.map((item) => (
                    <WishlistItemCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}  
                        onSelect={(checked) => handleSelectItem(item.id, checked)}  
                        onRemove={handleRemoveItem}
                    />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {items.length} of {pagination.total} items
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}

// Import skeleton
import { WishlistSkeleton } from "./WishlistSkeleton";