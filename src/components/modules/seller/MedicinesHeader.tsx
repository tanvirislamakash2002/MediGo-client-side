"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function MedicinesHeader() {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">My Medicines</h1>
                <p className="text-muted-foreground">Manage your medicine inventory</p>
            </div>
            <Button onClick={() => router.push("/seller/medicines/add")}>
                + Add New Medicine
            </Button>
        </div>
    );
}