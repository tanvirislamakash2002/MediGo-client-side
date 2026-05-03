"use client";

import { useState, useCallback, useEffect } from "react";
import { addToWishlist, removeFromWishlist, checkInWishlist } from "@/actions/wishlist.action";
import { toast } from "sonner";
import { getSession } from "@/actions/auth.action";

export function useWishlist() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data, success } = await getSession();
                setIsAuthenticated(!!data && success === true);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);
    const [isWishlistLoading, setIsWishlistLoading] = useState<Record<string, boolean>>({});

    const toggleWishlist = useCallback(async (medicineId: string, isInWishlist: boolean) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to wishlist");
            return false;
        }

        setIsWishlistLoading(prev => ({ ...prev, [medicineId]: true }));

        try {
            let result;
            if (isInWishlist) {
                result = await removeFromWishlist(medicineId);
                if (result.success) {
                    toast.success("Removed from wishlist");
                }
            } else {
                result = await addToWishlist(medicineId);
                if (result.success) {
                    toast.success("Added to wishlist");
                }
            }

            return result?.success || false;
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        } finally {
            setIsWishlistLoading(prev => ({ ...prev, [medicineId]: false }));
        }
    }, [isAuthenticated]);

    const checkWishlistStatus = useCallback(async (medicineId: string) => {
        if (!isAuthenticated) return false;

        try {
            const result = await checkInWishlist(medicineId);
            return result.success ? result.data?.inWishlist || false : false;
        } catch (error) {
            return false;
        }
    }, [isAuthenticated]);

    return {
        toggleWishlist,
        checkWishlistStatus,
        isWishlistLoading
    };
}