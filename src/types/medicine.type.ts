export interface Medicine {
    id: string | number;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string;
    requiresPrescription: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: string | number;
    sellerId: string | number
}

export interface MedicineData {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    categoryId: string;
    imageUrl: string;
    requiresPrescription: boolean;
};

export interface GetMedicinesParams {
    search?: string;
    categoryId?: string;
    categoryName?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    manufacturer?: string;
    manufacturerList?: string[];
    requiresPrescription?: boolean;
    inStock?: boolean;
    sellerId?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}