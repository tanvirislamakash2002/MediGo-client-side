"use server";

import { userService } from "@/services/user.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env";

// Get current session
export const getSession = async () => {
    return await userService.getSession();
};
