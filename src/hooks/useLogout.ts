"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { handleAuthChange } from "@/lib/auth-sync";

export const useLogout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const logout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await authClient.signOut();
            handleAuthChange(dispatch, true);
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
