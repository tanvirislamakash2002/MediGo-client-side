"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MedicineCard } from "@/components/modules/seller/medicine-card";
import { DeleteConfirmationModal } from "@/components/modules/seller/delete-modal";
import { Pagination } from "@/components/ui/pagination";
import { getSellerMedicines, deleteMedicine } from "@/actions/medicine.action";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
    items: Medicine[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface MedicinesGridProps {
    initialData: MedicinesResponse | null;
    initialSearch: string;
    initialPage: number;
    initialLimit: number;
}

export function MedicinesGrid({
    initialData,
    initialSearch,
    initialPage,
    initialLimit
}: MedicinesGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [medicinesData, setMedicinesData] = useState<MedicinesResponse | null>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Get current values from URL
    const currentSearch = searchParams.get('search') || initialSearch;
    const currentPage = parseInt(searchParams.get('page') || initialPage.toString());
    const currentLimit = parseInt(searchParams.get('limit') || initialLimit.toString());

    // Fetch medicines when URL params change
    useEffect(() => {
        const fetchMedicines = async () => {
            setIsLoading(true);
            try {
                const result = await getSellerMedicines({
                    search: currentSearch,
                    page: currentPage,
                    limit: currentLimit
                });
                if (!result.success) {
                    toast.error(result?.message);
                } else {
                    setMedicinesData(result?.data);
                }
            } catch (err) {
                toast.error("Failed to fetch medicines");
            } finally {
                setIsLoading(false);
            }
        };
        // Only fetch if initial data is not for current params
        if (currentSearch !== initialSearch ||
            currentPage !== initialPage ||
            currentLimit !== initialLimit) {
            fetchMedicines();
        }
    }, [currentSearch, currentPage, currentLimit, initialSearch, initialPage, initialLimit]);

    const handleDelete = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedMedicine) return;

        const toastId = toast.loading("Deleting medicine...");

        try {
            // Use the server action instead of direct fetch
            const result = await deleteMedicine(selectedMedicine.id);

            if (!result?.success) {
                toast.error(result?.message, { id: toastId });
                return;
            }

            toast.success("Medicine deleted successfully", { id: toastId });
            setShowDeleteModal(false);
            setSelectedMedicine(null);

            // Refetch current page using startTransition for better UX
            startTransition(async () => {
                const fetchResult = await getSellerMedicines({
                    search: currentSearch,
                    page: currentPage,
                    limit: currentLimit
                });
                if (fetchResult.success) {
                    setMedicinesData(fetchResult.data);
                }
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete medicine", { id: toastId });
        }
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`/seller/medicines?${params.toString()}`);
    };

    if (isLoading || isPending) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(currentLimit)].map((_, i) => (
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
        );
    }
    if (!medicinesData?.items?.length) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No medicines found</p>
                    <Button onClick={() => router.push("/seller/medicines/add")}>
                        Add Your First Medicine
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicinesData?.items.map((medicine: Medicine) => (
                    <MedicineCard
                        key={medicine.id}
                        medicine={medicine}
                        onEdit={() => router.push(`/seller/medicines/edit/${medicine.id}`)}
                        onDelete={() => handleDelete(medicine)}
                    />
                ))}
            </div>

            {medicinesData.pagination && (
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
                        totalPages={medicinesData.pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                medicine={selectedMedicine}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedMedicine(null);
                }}
            />
        </>
    );
}