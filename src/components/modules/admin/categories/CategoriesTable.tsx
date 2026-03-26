"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { Search, X, MoreHorizontal, Pencil, Trash2, Package } from "lucide-react";
import { getAllCategories, deleteCategory } from "@/actions/category.action";
import { toast } from "sonner";
import { CategoriesSkeleton } from "./CategoriesSkeleton";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { AddCategoryModal } from "./AddCategoryModal";

interface Category {
    id: string;
    name: string;
    description: string | null;
    productCount: number;
    createdAt: string;
}

interface CategoriesTableProps {
    initialCategories: Category[];
    initialSearch?: string;
    initialSort?: string;
    initialPage: number;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "products", label: "Most Products" },
];

export function CategoriesTable({
    initialCategories,
    initialSearch = "",
    initialSort = "name",
    initialPage,
    pagination: initialPagination
}: CategoriesTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());
    const currentSort = searchParams.get("sort") || initialSort;

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            const searchValue = searchParams.get("search") || "";
            const sortValue = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");

            const result = await getAllCategories({
                search: searchValue,
                sort: sortValue,
                page
            });
            console.log(result);
            if (!result.error) {
                setCategories(result.data?.data?.categories || []);
                setPagination(result.data?.data?.pagination);
            }
            setIsLoading(false);
        };

        fetchCategories();
    }, [searchParams, initialSort]);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/admin/categories?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters("search", search);
    };

    const clearSearch = () => {
        setSearch("");
        updateFilters("search", "");
    };

    const handleSortChange = (sort: string) => {
        updateFilters("sort", sort);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/admin/categories?${params.toString()}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCategory) return;

        const result = await deleteCategory(selectedCategory.id);
        if (result.error) {
            toast.error(result.error.message);
        } else {
            toast.success("Category deleted successfully");
            router.refresh();
        }
        setShowDeleteModal(false);
        setSelectedCategory(null);
    };

    const getSortLabel = () => {
        const option = sortOptions.find(o => o.value === currentSort);
        return option?.label || "Sort by";
    };

    if (isLoading && categories.length === 0) {
        return <CategoriesSkeleton />;
    }
    return (
        <>
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-8"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                </form>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-[140px]">
                            {getSortLabel()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {sortOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Categories Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-center w-24">Products</TableHead>
                            <TableHead className="hidden lg:table-cell w-32">Created</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">No categories found</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAddModal(true)}
                                        >
                                            Create your first category
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-md truncate">
                                        {category.description || "—"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-mono">
                                            {category.productCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                        {formatDate(category.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(category)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} categories
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Modals */}
            <EditCategoryModal
                isOpen={showEditModal}
                category={selectedCategory}
                onClose={() => setShowEditModal(false)}
                onSuccess={() => router.refresh()}
            />

            <DeleteCategoryModal
                isOpen={showDeleteModal}
                category={selectedCategory}
                onConfirm={handleDeleteConfirm}
                onClose={() => setShowDeleteModal(false)}
            />

            <AddCategoryModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
        </>
    );
}