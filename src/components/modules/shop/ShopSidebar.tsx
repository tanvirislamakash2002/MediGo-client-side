"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Category {
    id: string;
    name: string;
}

interface ShopSidebarProps {
    categories: Category[];
    initialCategoryId: string;
    initialMinPrice?: number;
    initialMaxPrice?: number;
    initialManufacturer: string;
    initialRequiresPrescription?: boolean;
    initialInStock: boolean;
}

export function ShopSidebar({ 
    categories, 
    initialCategoryId,
    initialMinPrice,
    initialMaxPrice,
    initialManufacturer,
    initialRequiresPrescription,
    initialInStock
}: ShopSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        initialMinPrice || 0,
        initialMaxPrice || 500
    ]);
    const [manufacturer, setManufacturer] = useState(initialManufacturer);
    const [requiresPrescription, setRequiresPrescription] = useState(initialRequiresPrescription || false);
    const [inStock, setInStock] = useState(initialInStock);

    const updateFilters = () => {
        const params = new URLSearchParams(searchParams);
        
        if (selectedCategory) params.set('categoryId', selectedCategory);
        else params.delete('categoryId');
        
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
        else params.delete('minPrice');
        
        if (priceRange[1] < 500) params.set('maxPrice', priceRange[1].toString());
        else params.delete('maxPrice');
        
        if (manufacturer) params.set('manufacturer', manufacturer);
        else params.delete('manufacturer');
        
        if (requiresPrescription) params.set('requiresPrescription', 'true');
        else params.delete('requiresPrescription');
        
        if (inStock) params.set('inStock', 'true');
        else params.delete('inStock');
        
        params.set('page', '1');
        
        router.push(`/shop?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setPriceRange([0, 500]);
        setManufacturer("");
        setRequiresPrescription(false);
        setInStock(false);
        
        router.push("/shop");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Categories */}
                <Accordion type="single" collapsible defaultValue="categories">
                    <AccordionItem value="categories">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center">
                                        <Checkbox
                                            id={category.id}
                                            checked={selectedCategory === category.id}
                                            onCheckedChange={(checked) => {
                                                setSelectedCategory(checked ? category.id : "");
                                            }}
                                        />
                                        <Label 
                                            htmlFor={category.id} 
                                            className="ml-2 cursor-pointer"
                                        >
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Price Range */}
                <Accordion type="single" collapsible defaultValue="price">
                    <AccordionItem value="price">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                <Slider
                                    min={0}
                                    max={500}
                                    step={10}
                                    value={priceRange}
                                    onValueChange={(value) => setPriceRange(value as [number, number])}
                                />
                                <div className="flex justify-between">
                                    <span className="text-sm">${priceRange[0]}</span>
                                    <span className="text-sm">${priceRange[1]}</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Manufacturer */}
                <Accordion type="single" collapsible defaultValue="manufacturer">
                    <AccordionItem value="manufacturer">
                        <AccordionTrigger>Manufacturer</AccordionTrigger>
                        <AccordionContent>
                            <Input
                                placeholder="Search manufacturer..."
                                value={manufacturer}
                                onChange={(e) => setManufacturer(e.target.value)}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Additional Filters */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="prescription"
                            checked={requiresPrescription}
                            onCheckedChange={(checked) => setRequiresPrescription(checked as boolean)}
                        />
                        <Label htmlFor="prescription">Prescription Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="inStock"
                            checked={inStock}
                            onCheckedChange={(checked) => setInStock(checked as boolean)}
                        />
                        <Label htmlFor="inStock">In Stock Only</Label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Button onClick={updateFilters} className="w-full">
                        Apply Filters
                    </Button>
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                        Clear All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}