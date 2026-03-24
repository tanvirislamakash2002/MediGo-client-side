"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMedicines } from "@/actions/medicine.action";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface Medicine {
    id: string;
    name: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
}

interface RelatedMedicinesProps {
    categoryId: string;
    currentMedicineId: string;
}

export function RelatedMedicines({ categoryId, currentMedicineId }: RelatedMedicinesProps) {
    const router = useRouter();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedMedicines = async () => {
            setIsLoading(true);
            try {
                const result = await getMedicines({
                    categoryId,
                    limit: 4,
                    page: 1
                });
                if (!result.error && result.data) {
                    // Filter out current medicine
                    const filtered = result.data.data.filter(
                        (med: Medicine) => med.id !== currentMedicineId
                    );
                    setMedicines(filtered.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch related medicines:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelatedMedicines();
    }, [categoryId, currentMedicineId]);

    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    if (isLoading) {
        return (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Medicines</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <Skeleton className="h-32 w-full mb-3" />
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-6 w-1/3 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (medicines.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Medicines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {medicines.map((medicine) => (
                    <Card 
                        key={medicine.id} 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => router.push(`/shop/${medicine.id}`)}
                    >
                        <div className="relative h-32 bg-muted">
                            {isValidUrl(medicine.imageUrl) ? (
                                <Image
                                    src={medicine.imageUrl!}
                                    alt={medicine.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-2xl">
                                    💊
                                </div>
                            )}
                            {medicine.requiresPrescription && (
                                <Badge className="absolute top-1 right-1 bg-red-500 text-xs">
                                    Rx
                                </Badge>
                            )}
                        </div>
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm font-semibold line-clamp-1">
                                {medicine.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {medicine.manufacturer}
                            </p>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0 flex justify-between items-center">
                            <span className="font-bold text-primary">
                                ${medicine.price.toFixed(2)}
                            </span>
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Add to cart logic
                                }}
                                disabled={medicine.stock <= 0}
                            >
                                <ShoppingCart className="h-3 w-3" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}