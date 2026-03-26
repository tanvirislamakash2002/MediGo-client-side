"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    manufacturer: string;
    requiresPrescription: boolean;
}

interface Order {
    id: string;
    items?: OrderItem[];
}

interface OrderItemsProps {
    order: Order;
}

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

export function OrderItems({ order }: OrderItemsProps) {
    const items = order.items || [];
    const hasItems = items.length > 0;
    // Transform items to handle both flat and nested structure
    const transformedItems = items.map(item => ({
        id: item.id,
        name: (item as any).medicine?.name || "Unknown Medicine",
        price: (item as any).medicine?.price || 0,
        quantity: item.quantity || 0,
        imageUrl: (item as any).medicine?.imageUrl || null,
        manufacturer: (item as any).medicine?.manufacturer || "Unknown Manufacturer",
        requiresPrescription: (item as any).medicine?.requiresPrescription || false
    }));
    
    const subtotal = hasItems 
        ? transformedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
        : 0;

    if (!hasItems) {
        return (
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 border-b">
                    <h2 className="font-semibold">Items</h2>
                </div>
                <div className="p-8 text-center text-muted-foreground">
                    No items found for this order
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
                <h2 className="font-semibold">Items ({transformedItems.length})</h2>
            </div>
            <div className="divide-y">
                {transformedItems.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {isValidUrl(item.imageUrl) ? (
                                <Image
                                    src={item.imageUrl!}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-3xl">💊</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap justify-between gap-2">
                                <div>
                                    <Link
                                        href={`/shop/${item.id}`}
                                        className="font-medium hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        {item.manufacturer}
                                    </p>
                                    {item.requiresPrescription && (
                                        <Badge
                                            variant="outline"
                                            className="mt-1 text-xs bg-red-50 text-red-700 border-red-200"
                                        >
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Prescription Required
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        ${item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-muted/30 px-4 py-3 border-t flex justify-between">
                <span className="font-medium">Subtotal ({transformedItems.length} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
        </div>
    );
}