"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Heart, Truck, Shield, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

interface Medicine {
    id: string;
    name: string;
    price: number;
    stock: number;
    manufacturer: string;
    requiresPrescription: boolean;
    category: { 
        id: string; 
        name: string 
    };
}

interface MedicineActionsProps {
    medicine: Medicine;
}

export function MedicineActions({ medicine }: MedicineActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleQuantityChange = (value: number) => {
        if (value >= 1 && value <= medicine.stock) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        // Add to cart logic here
        toast.success(`Added ${quantity} x ${medicine.name} to cart`);
        setIsAddingToCart(false);
    };

    const handleAddToWishlist = () => {
        toast.info("Added to wishlist");
    };

    return (
        <div className="space-y-6">
            {/* Title & Category */}
            <div>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{medicine.name}</h1>
                        <p className="text-muted-foreground mt-1">{medicine.manufacturer}</p>
                    </div>
                    {medicine.requiresPrescription && (
                        <Badge variant="destructive" className="bg-red-500">
                            <FileText className="h-3 w-3 mr-1" />
                            Prescription Required
                        </Badge>
                    )}
                </div>
                <div className="mt-2">
                    <Badge variant="outline" className="text-sm">
                        {medicine.category.name}
                    </Badge>
                </div>
            </div>

            {/* Price & Stock */}
            <div className="border-t border-b py-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="text-3xl font-bold">${medicine.price.toFixed(2)}</span>
                        <span className="text-muted-foreground ml-1">per piece</span>
                    </div>
                    <div className="text-right">
                        {medicine.stock <= 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                        ) : medicine.stock < 10 ? (
                            <Badge variant="secondary" className="bg-yellow-500 text-white">
                                Only {medicine.stock} left
                            </Badge>
                        ) : (
                            <Badge variant="default" className="bg-green-500 text-white">
                                In Stock
                            </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Free shipping on orders over $50
                        </p>
                    </div>
                </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1 || medicine.stock <= 0}
                        className="h-10 w-10"
                    >
                        -
                    </Button>
                    <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                        min={1}
                        max={medicine.stock}
                        disabled={medicine.stock <= 0}
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= medicine.stock || medicine.stock <= 0}
                        className="h-10 w-10"
                    >
                        +
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {medicine.stock} pieces available
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={medicine.stock <= 0 || isAddingToCart}
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToWishlist}
                >
                    <Heart className="h-5 w-5" />
                </Button>
            </div>

            {/* Delivery & Trust Badges */}
            <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span>Free delivery on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Estimated delivery: 2-4 business days</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span>100% genuine medicines guaranteed</span>
                </div>
            </div>

            {/* Prescription Notice */}
            {medicine.requiresPrescription && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ This medicine requires a valid prescription. Please upload your prescription during checkout.
                    </p>
                </div>
            )}
        </div>
    );
}