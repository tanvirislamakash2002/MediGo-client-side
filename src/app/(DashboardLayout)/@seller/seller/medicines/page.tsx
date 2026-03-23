"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { MedicineCard } from "@/components/modules/seller/medicine-card";
import { DeleteConfirmationModal } from "@/components/modules/seller/delete-modal";
import { Pagination } from "@/components/ui/pagination";
import { getMedicines } from "@/actions/medicine.action";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

interface MedicinesResponse {
    data: Medicine[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
}

export default function MedicinesPage({ searchParams }: { searchParams: Promise<{ page: string; search?: string; limit?: string }> }) {
    const router = useRouter();
    
    // State for search, page, and limit
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(9); // Default 9 items per page
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medicinesData, setMedicinesData] = useState<MedicinesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize from URL params
    useEffect(() => {
        const initParams = async () => {
            const params = await searchParams;
            const pageFromUrl = params.page ? parseInt(params.page) : 1;
            const searchFromUrl = params.search || "";
            const limitFromUrl = params.limit ? parseInt(params.limit) : 9;
            
            setCurrentPage(pageFromUrl);
            setSearch(searchFromUrl);
            setLimit(limitFromUrl);
        };
        
        initParams();
    }, [searchParams]);

    // Fetch medicines
    const fetchMedicines = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getMedicines({ 
                search: search, 
                page: currentPage,
                limit: limit
            });
            if (result.error) {
                setError(result.error.message);
            } else {
                setMedicinesData(result.data);
            }
        } catch (err) {
            setError("Failed to fetch medicines");
        } finally {
            setIsLoading(false);
        }
    }, [search, currentPage, limit]);

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    // Handle page change - update URL
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Update URL with new page
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (limit !== 9) params.set('limit', limit.toString());
        if (page > 1) params.set('page', page.toString());
        router.push(`/seller/medicines?${params.toString()}`);
    };

    // Handle limit change - update URL
    const handleLimitChange = (value: string) => {
        const newLimit = parseInt(value);
        setLimit(newLimit);
        setCurrentPage(1); // Reset to first page when changing items per page
        
        // Update URL
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (newLimit !== 9) params.set('limit', newLimit.toString());
        if (currentPage > 1) params.set('page', '1');
        router.push(`/seller/medicines?${params.toString()}`);
    };

    // Handle search - update URL
    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1); // Reset to first page when searching
        
        // Update URL
        const params = new URLSearchParams();
        if (value) params.set('search', value);
        if (limit !== 9) params.set('limit', limit.toString());
        router.push(`/seller/medicines?${params.toString()}`);
    };

    const handleDelete = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedMedicine) return;
        
        try {
            const response = await fetch(`/api/seller/medicines/${selectedMedicine.id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message);
            }
            
            toast.success("Medicine deleted successfully");
            setShowDeleteModal(false);
            setSelectedMedicine(null);
            
            // Refetch current page
            fetchMedicines();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete medicine");
        }
    };

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">My Medicines</h1>
                    <p className="text-muted-foreground">Manage your medicine inventory</p>
                </div>
                <Button onClick={() => router.push("/seller/medicines/add")}>
                    + Add New Medicine
                </Button>
            </div>

            {/* Search and Limit Controls */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search Medicines</Label>
                            <Input
                                id="search"
                                placeholder="Search by name, manufacturer, or category..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className="w-32">
                            <Label htmlFor="limit">Items per page</Label>
                            <Select value={limit.toString()} onValueChange={handleLimitChange}>
                                <SelectTrigger id="limit" className="mt-1">
                                    <SelectValue placeholder="Select limit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="9">9</SelectItem>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="18">18</SelectItem>
                                    <SelectItem value="24">24</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medicines Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(limit)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <Skeleton className="h-48 w-full mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3 mb-4" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : medicinesData?.data?.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No medicines found</p>
                        <Button onClick={() => router.push("/seller/medicines/add")}>
                            Add Your First Medicine
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {medicinesData?.data?.map((medicine: Medicine) => (
                            <MedicineCard
                                key={medicine.id}
                                medicine={medicine}
                                onEdit={() => router.push(`/seller/medicines/edit/${medicine.id}`)}
                                onDelete={() => handleDelete(medicine)}
                            />
                        ))}
                    </div>

                    {/* Pagination with Info */}
                    {medicinesData?.pagination && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                            <p className="text-sm text-muted-foreground">
                                Showing {((medicinesData.pagination.page - 1) * medicinesData.pagination.limit) + 1} to{' '}
                                {Math.min(
                                    medicinesData.pagination.page * medicinesData.pagination.limit,
                                    medicinesData.pagination.total
                                )}{' '}
                                of {medicinesData.pagination.total} medicines
                            </p>
                            <Pagination
                                currentPage={medicinesData.pagination.page}
                                totalPages={medicinesData.pagination.totalPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                medicine={selectedMedicine}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedMedicine(null);
                }}
            />
        </div>
    );
}