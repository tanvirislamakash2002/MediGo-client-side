import { AppDispatch } from "@/redux/store";
import { clearWishlist, setWishlistInitialized } from "@/redux/features/wishlist/wishlist.slice";
import { setCart, setInitialized } from "@/redux/features/cart/cart.slice";
import { resetWishlistCache } from "@/hooks/useWishlist";
import { resetCartCache } from "@/hooks/useCart";

/**
 * Synchronizes Redux state and resets client-side auth caches
 * whenever the user's authentication state changes (login or logout).
 */
export function handleAuthChange(dispatch: AppDispatch, isLoggingOut = false) {
    // Reset singleton in-flight and cached auth promises
    resetWishlistCache();
    resetCartCache();

    // Reset initialization flags so next mount re-evaluates fresh session data
    dispatch(setWishlistInitialized(false));
    dispatch(setInitialized(false));

    if (isLoggingOut) {
        // Clear all sensitive user state on logout
        dispatch(clearWishlist());
        dispatch(setCart([]));
    }
}
