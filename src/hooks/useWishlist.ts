"use client";

import { useState, useCallback, useEffect } from "react";
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction, getWishlist } from "@/actions/wishlist.action";
import { toast } from "sonner";
import { getSession } from "@/actions/auth.action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    setWishlist,
    addToWishlistOptimistic,
    removeFromWishlistOptimistic,
    setWishlistLoading,
} from "@/redux/features/wishlist/wishlist.slice";
import { IWishlistItem } from "@/redux/features/wishlist/wishlist.type";

// Deduplicate authentication checks across mounting components
let authPromise: Promise<{ isAuthenticated: boolean }> | null = null;
let isFetchingWishlist = false;

export function resetWishlistCache() {
    authPromise = null;
    isFetchingWishlist = false;
}

export function useWishlist() {
    const dispatch = useAppDispatch();

    const wishlist = useAppSelector((state) => state.wishlist.items);
    const wishlistIds = useAppSelector((state) => state.wishlist.itemIds);
    const isInitialized = useAppSelector((state) => state.wishlist.isInitialized);
    const isReduxLoading = useAppSelector((state) => state.wishlist.isLoading);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(!isInitialized);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

    // Fast O(1) membership check
    const isInWishlist = useCallback(
        (medicineId: string) => wishlistIds.includes(medicineId),
        [wishlistIds]
    );

    const wishlistCount = wishlistIds.length;

    // Deduplicated auth check
    useEffect(() => {
        let isMounted = true;

        if (!authPromise) {
            authPromise = getSession()
                .then(({ data, success }) => ({
                    isAuthenticated: !!data && success === true,
                }))
                .catch((err) => {
                    console.error("Auth check failed:", err);
                    return { isAuthenticated: false };
                });
        }

        authPromise.then((res) => {
            if (isMounted) {
                setIsAuthenticated(res.isAuthenticated);
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch wishlist from server and sync to Redux
    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated || isFetchingWishlist) return;
        isFetchingWishlist = true;
        dispatch(setWishlistLoading(true));

        try {
            const result = await getWishlist(1, 100);
            if (result.success && result.data?.items) {
                let allItems = result.data.items;
                const pagination = result.data.pagination;
                if (pagination && pagination.totalPages > 1) {
                    for (let p = 2; p <= Math.min(pagination.totalPages, 5); p++) {
                        const nextRes = await getWishlist(p, 100);
                        if (nextRes.success && nextRes.data?.items) {
                            allItems = [...allItems, ...nextRes.data.items];
                        }
                    }
                }
                dispatch(setWishlist(allItems));
            }
        } catch (error) {
            console.error("Failed to load wishlist:", error);
        } finally {
            isFetchingWishlist = false;
            dispatch(setWishlistLoading(false));
        }
    }, [isAuthenticated, dispatch]);

    // Initial load: Only runs if the wishlist has not been initialized yet
    useEffect(() => {
        if (isLoading || isInitialized) return;

        if (isAuthenticated) {
            fetchWishlist();
        } else {
            dispatch(setWishlist([]));
        }
    }, [isAuthenticated, isLoading, isInitialized, fetchWishlist, dispatch]);

    // Optimistic toggle
    const toggleWishlist = useCallback(
        async (medicineId: string, currentStatus?: boolean, medicineData?: any) => {
            if (!isAuthenticated) {
                toast.error("Please login to add items to wishlist");
                return false;
            }

            const currentlyIn = typeof currentStatus === "boolean" ? currentStatus : wishlistIds.includes(medicineId);

            // 1. Instantly update Redux (0ms UI latency)
            if (currentlyIn) {
                dispatch(removeFromWishlistOptimistic(medicineId));
            } else {
                dispatch(
                    addToWishlistOptimistic({
                        medicineId,
                        item: medicineData
                            ? {
                                  id: `temp-${medicineId}`,
                                  medicineId,
                                  addedAt: new Date().toISOString(),
                                  medicine: medicineData,
                              }
                            : undefined,
                    })
                );
            }

            setActionLoading((prev) => ({ ...prev, [medicineId]: true }));

            try {
                const result = currentlyIn
                    ? await removeFromWishlistAction(medicineId)
                    : await addToWishlistAction(medicineId);

                if (!result.success) {
                    toast.error(result.message || "Failed to update wishlist");
                    // Rollback from server
                    await fetchWishlist();
                    return false;
                }

                toast.success(currentlyIn ? "Removed from wishlist" : "Added to wishlist");
                return true;
            } catch (error) {
                console.error("Toggle wishlist error:", error);
                toast.error("Something went wrong");
                await fetchWishlist(); // Rollback
                return false;
            } finally {
                setActionLoading((prev) => ({ ...prev, [medicineId]: false }));
            }
        },
        [isAuthenticated, wishlistIds, dispatch, fetchWishlist]
    );

    // Backward-compatible check function that runs instantaneously from Redux cache
    const checkWishlistStatus = useCallback(
        async (medicineId: string) => {
            return wishlistIds.includes(medicineId);
        },
        [wishlistIds]
    );

    return {
        wishlist,
        wishlistIds,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        checkWishlistStatus,
        fetchWishlist,
        isWishlistLoading: actionLoading,
        isLoading: isLoading || isReduxLoading,
        isAuthenticated,
    };
}
