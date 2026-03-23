"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
    category: {
        id: string;
        name: string;
    };
}


export function MedicineCard({
    medicine,
    onEdit,
    onDelete }: {
        medicine: Medicine;
        onEdit: () => void;
        onDelete: () => void;
    }) {
    const getStockBadge = () => {
        if (medicine.stock <= 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (medicine.stock < 10) {
            return (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Low Stock: {medicine.stock}
                </Badge>
            );
        }
        return <Badge variant="default">In Stock: {medicine.stock}</Badge>;
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
                {medicine.imageUrl ? (
                    <Image
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-4xl text-muted-foreground">
                        💊
                    </div>
                )}
                {medicine.requiresPrescription && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                        Prescription Required
                    </Badge>
                )}
            </div>

            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {medicine.category?.name}
                        </p>
                    </div>
                    <span className="text-xl font-bold text-primary">
                        ${medicine.price.toFixed(2)}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {medicine.description}
                </p>
                <p className="text-xs text-muted-foreground">
                    Manufacturer: {medicine.manufacturer}
                </p>
                <div className="pt-2">{getStockBadge()}</div>
            </CardContent>

            <CardFooter className="gap-2">
                <Button variant="outline" className="flex-1" onClick={onEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button variant="destructive" className="flex-1" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}