import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

export const categoryService = {
    // Get all categories with pagination, search, and sorting
    getAllCategories: async (params?: {
        search?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }) => {
        try {
            const url = new URL(`${API_URL}/category`);
            
            if (params?.search) {
                url.searchParams.append("search", params.search);
            }
            if (params?.sort) {
                url.searchParams.append("sort", params.sort);
            }
            if (params?.page) {
                url.searchParams.append("page", params.page.toString());
            }
            if (params?.limit) {
                url.searchParams.append("limit", params.limit.toString());
            }
            
            const res = await fetch(url.toString(), {
                next: { tags: ["categories"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    data: null, 
                    error: { message: data.message || "Failed to fetch categories" } 
                };
            }
            return { data, error: null };
        } catch (error) {
            console.error("Get categories error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Get all categories 
    getCategories: async () => {
        try {
            const res = await fetch(`${API_URL}/category`, {
                next: { tags: ["categories"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    data: null, 
                    error: { message: data.message || "Failed to fetch categories" } 
                };
            }
            
            return { data, error: null };
        } catch (error) {
            console.error("Get categories error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    getCategoryById: async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/category/${id}`, {
                next: { tags: [`category-${id}`] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    data: null, 
                    error: { message: data.message || "Category not found" } 
                };
            }
            
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    createCategory: async (data: { name: string; description?: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (!res.ok) {
                return { 
                    data: null, 
                    error: { message: result.message || "Failed to create category" } 
                };
            }
            
            return { data: result, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    updateCategory: async (id: string, data: { name?: string; description?: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/category/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (!res.ok) {
                return { 
                    data: null, 
                    error: { message: result.message || "Failed to update category" } 
                };
            }
            
            return { data: result, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    deleteCategory: async (id: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/category/${id}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString()
                }
            });
            const result = await res.json();
            
            if (!res.ok) {
                return { 
                    data: null, 
                    error: { message: result.message || "Failed to delete category" } 
                };
            }
            
            return { data: result, error: null };
        } catch (error) {
            return { data: null, error: { message: "Something went wrong" } };
        }
    }
};