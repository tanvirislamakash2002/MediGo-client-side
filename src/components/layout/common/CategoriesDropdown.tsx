"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/actions/category.action";
import { ChevronRight, Eye } from "lucide-react";

interface Category {
    id: string;
    name: string;
    description: string;
}

export function CategoriesDropdown() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getAllCategories();
            if (result.success && result?.data) {
                setCategories(result?.data?.categories.slice(0, 5));
            }
            setIsLoading(false);
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/shop?categoryId=${encodeURIComponent(categoryId)}`);
        setIsOpen(false);
    };

    const handleViewAll = () => {
        router.push("/categories");
        setIsOpen(false);
    };

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Categories Button */}
            <button
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-primary hover:bg-muted flex items-center gap-1"
                onClick={() => router.push("/categories")}
            >
                Categories
                <ChevronRight className="h-3 w-3 rotate-90" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-0 w-64 bg-popover rounded-md shadow-lg border z-50">
                    <div className="p-2">
                        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Popular Categories
                        </p>
                        {isLoading ? (
                            <div className="px-2 py-3 text-sm text-muted-foreground">
                                Loading...
                            </div>
                        ) : categories.length > 0 ? (
                            <div className="space-y-0.5">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                        className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-2 py-3 text-sm text-muted-foreground">
                                No categories available
                            </div>
                        )}
                        <div className="border-t my-1" />
                        <button
                            onClick={handleViewAll}
                            className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-primary hover:bg-muted rounded-md transition-colors"
                        >
                            <span>View All Categories</span>
                            <Eye className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}