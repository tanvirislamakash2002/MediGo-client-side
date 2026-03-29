"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Pill } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

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
    const { addToCart, isAdding } = useCart();

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
        await addToCart(medicine.id, 1, medicine);
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
                {medicine.requiresPrescription && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                        Rx Required
                    </Badge>
                )}
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