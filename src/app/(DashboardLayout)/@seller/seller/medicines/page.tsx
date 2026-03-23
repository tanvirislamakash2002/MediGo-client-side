"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./components/delete-modal";
import { MedicineCard } from "@/components/modules/seller/medicine-card";

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

export default function MedicinesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch medicines
  const { data, isLoading } = useQuery({
    queryKey: ["seller-medicines", search],
    queryFn: async () => {
      const response = await fetch(`/api/seller/medicines?search=${search}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/seller/medicines/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      toast.success("Medicine deleted successfully");
      setShowDeleteModal(false);
      setSelectedMedicine(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete medicine");
    },
  });

  const handleDelete = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedMedicine) {
      deleteMutation.mutate(selectedMedicine.id);
    }
  };

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
      ) : data?.medicines?.length === 0 ? (
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
          {data?.medicines?.map((medicine: Medicine) => (
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
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}