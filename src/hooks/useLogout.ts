"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await authClient.signOut();
            toast.success("Logged out successfully", { id: toastId });
            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error("Failed to logout", { id: toastId });
            console.error("Logout error:", error);
        }
    };

    return { logout };
};

// Usage in component:
// const { logout } = useLogout();
// <button onClick={logout}>Logout</button>