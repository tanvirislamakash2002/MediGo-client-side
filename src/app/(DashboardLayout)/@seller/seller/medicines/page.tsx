"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MedicineCard } from "@/components/modules/seller/medicine-card";
import { DeleteConfirmationModal } from "@/components/modules/seller/delete-modal";
import { getMedicines } from "@/actions/medicine.action";

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

export default function MedicinesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medicinesData, setMedicinesData] = useState<MedicinesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch medicines
    useEffect(() => {
        const fetchMedicines = async () => {
            setIsLoading(true);
            try {
                const result = await getMedicines();
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
        };

        fetchMedicines();
    }, [search]); // Add search as dependency if you want to refetch on search

    // Delete mutation (keep React Query for mutations only)
    // const deleteMutation = useMutation({
    //     mutationFn: async (id: string) => {
    //         const response = await fetch(`/api/seller/medicines/${id}`, {
    //             method: "DELETE",
    //         });
    //         const result = await response.json();
    //         if (!result.success) throw new Error(result.message);
    //         return result;
    //     },
    //     onSuccess: () => {
    //         // Refetch medicines after deletion
    //         const fetchMedicines = async () => {
    //             const result = await getMedicines();
    //             if (!result.error) {
    //                 setMedicinesData(result.data);
    //             }
    //         };
    //         fetchMedicines();
    //         toast.success("Medicine deleted successfully");
    //         setShowDeleteModal(false);
    //         setSelectedMedicine(null);
    //     },
    //     onError: (error: Error) => {
    //         toast.error(error.message || "Failed to delete medicine");
    //     },
    // });

    const handleDelete = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedMedicine) {
            // deleteMutation.mutate(selectedMedicine.id);
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

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search Medicines</Label>
                            <Input
                                id="search"
                                placeholder="Search by name, manufacturer, or category..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medicines Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
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
                // isLoading={deleteMutation.isPending}
            />
        </div>
    );
}