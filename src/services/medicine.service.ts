import { env } from "@/env";
import { GetMedicinesParams, MedicineData } from "@/types/medicine.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const medicineService = {
    getMedicines: async (params?: GetMedicinesParams) => {
        try {
            const url = new URL(`${API_URL}/medicine`);

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        if (Array.isArray(value)) {
                            if (value.length > 0) {
                                url.searchParams.append(key, value.join(','));
                            }
                        }
                        else if (typeof value === 'boolean') {
                            url.searchParams.append(key, value.toString());
                        }
                        else if (typeof value === 'number') {
                            url.searchParams.append(key, value.toString());
                        }
                        else {
                            url.searchParams.append(key, value);
                        }
                    }
                });
            }

            const res = await fetch(url.toString(), {
                next: { tags: ["medicine"] }
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || 'Failed to fetch medicines' }
                };
            }

            return { data, error: null };
        } catch (error) {
            console.error('Get medicines error:', error);
            return { data: null, error: { message: 'Something went wrong' } };
        }
    },

     getSellerMedicines: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/medicine/my-medicines`);

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        url.searchParams.append(key, value.toString());
                    }
                });
            }

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString()
                },
                next: { tags: ["seller-medicines"] }
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || 'Failed to fetch seller medicines' }
                };
            }

            return { data, error: null };
        } catch (error) {
            console.error('Get seller medicines error:', error);
            return { data: null, error: { message: 'Something went wrong' } };
        }
    },
    
    getPriceRange: async () => {
        try {
            const res = await fetch(`${API_URL}/medicine/price-range`, {
                next: { tags: ["medicine"] }
            });
            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: 'Failed to fetch price range' } };
        }
    },

    getManufacturers: async () => {
        try {
            const res = await fetch(`${API_URL}/medicine/manufacturers`, {
                next: { tags: ["medicine"] }
            });
            const data = await res.json();
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: 'Failed to fetch manufacturers' } };
        }
    },
    getMedicineById: async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/medicine/${id}`)
            const data = await res.json()
            return { data, error: null }

        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } }

        }
    },
    addMedicine: async (medicineData: MedicineData) => {
        try {
            const cookieStore = await cookies()
            const res = await fetch(`${API_URL}/medicine`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(medicineData)
            })
            const data = await res.json()
            if (data.error) {
                return {
                    data: null,
                    error: { message: "Error:Medicine Is not Added" }
                }
            }
            return { data, error: null }


        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } }

        }
    },
    updateMedicine: async (id: string, medicineData: MedicineData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/medicine/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(medicineData)
            });
            const data = await res.json();
            if (data.error) {
                return {
                    data: null,
                    error: { message: "Error: Medicine could not be updated" }
                };
            }
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } };
        }
    },
    deleteMedicine: async (id: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/medicine/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                }
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Error: Medicine could not be deleted" }
                };
            }

            return { data, error: null };
        } catch (error) {
            console.error("Delete error:", error);
            return { data: null, error: { message: 'Something went wrong' } };
        }
    },
}