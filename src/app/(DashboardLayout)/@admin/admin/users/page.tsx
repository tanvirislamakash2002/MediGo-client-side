import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getAllUsers } from "@/actions/user.action";
import { UsersHeader } from "@/components/modules/admin/users/UsersHeader";
import { UsersStats } from "@/components/modules/admin/users/UsersStats";
import { UsersFilters } from "@/components/modules/admin/users/UsersFilters";
import { UsersTable } from "@/components/modules/admin/users/UsersTable";
import { UsersSkeleton } from "@/components/modules/admin/users/UsersSkeleton";

interface PageProps {
    searchParams: Promise<{
        role?: string;
        status?: string;
        verified?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

interface UsersResponse {
    success: boolean;
    data?: {
        users: any[];
        stats: {
            total: number;
            customers: number;
            sellers: number;
            admins: number;
            active: number;
            banned: number;
            verified: number;
            unverified: number;
        };
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
    message?: string;
}

export default async function UsersPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();

    if (!success || !session || session.user.role !== "ADMIN") {
        redirect("/login?redirect=/admin/users");
    }

    const params = await searchParams;
    const role = params.role;
    const status = params.status;
    const verified = params.verified;
    const search = params.search;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;

    const result = await getAllUsers({ role, status, verified, search, sort, page }) as UsersResponse;

    const defaultStats = {
        total: 0,
        customers: 0,
        sellers: 0,
        admins: 0,
        active: 0,
        banned: 0,
        verified: 0,
        unverified: 0
    };

    const users = result.success && result.data ? result.data.users : [];
    const stats = result.success && result.data ? result.data.stats : defaultStats;
    const pagination = result.success && result.data ? result.data.pagination : undefined;

    return (
        <div className="space-y-6">
            <UsersHeader />

            <UsersStats stats={stats} />

            <UsersFilters
                initialRole={role}
                initialStatus={status}
                initialVerified={verified}
                initialSearch={search}
                initialSort={sort}
            />

            <Suspense fallback={<UsersSkeleton />}>
                <UsersTable
                    initialUsers={users}
                    initialPage={page}
                    initialRole={role}
                    initialStatus={status}
                    initialVerified={verified}
                    initialSearch={search}
                    initialSort={sort}
                    pagination={pagination}
                />
            </Suspense>
        </div>
    );
}