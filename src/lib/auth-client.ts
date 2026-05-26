import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
    // Browser environment
    if (typeof window !== "undefined") {
        // Use the current origin (your frontend URL)
        return window.location.origin;
    }
    // Server-side rendering fallback
    return process.env.NEXT_PUBLIC_APP_URL || "https://medigo1.vercel.app";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    fetchOptions: {
        credentials: "include",
    },
});

declare module "better-auth/react" {
    interface User {
        role: "ADMIN" | "SELLER" | "CUSTOMER";
        phone?: string | null;
        isActive?: boolean;
    }

    interface Session {
        user: User;
    }
}