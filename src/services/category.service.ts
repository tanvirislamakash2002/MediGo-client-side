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
                    success: false,
                    message: data.message || "Failed to fetch categories"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Get categories error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get all categories (simple list)
    getCategories: async () => {
        try {
            const res = await fetch(`${API_URL}/category`, {
                next: { tags: ["categories"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to fetch categories"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Get categories error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
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
                    success: false,
                    message: data.message || "Category not found"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Get category by ID error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
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
                    success: false,
                    message: result.message || "Failed to create category"
                };
            }
            
            return { 
                success: true,
                data: result.data || result,
                message: "Category created successfully"
            };
        } catch (error) {
            console.error("Create category error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
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
                    success: false,
                    message: result.message || "Failed to update category"
                };
            }
            
            return { 
                success: true,
                data: result.data || result,
                message: "Category updated successfully"
            };
        } catch (error) {
            console.error("Update category error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
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
                    success: false,
                    message: result.message || "Failed to delete category"
                };
            }
            
            return { 
                success: true,
                message: "Category deleted successfully"
            };
        } catch (error) {
            console.error("Delete category error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    }
};