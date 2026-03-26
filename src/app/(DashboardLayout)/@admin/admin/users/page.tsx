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

export default async function UsersPage({ searchParams }: PageProps) {
    const { data: session, error: sessionError } = await getSession();
    
    if (sessionError || !session || session.user.role !== "ADMIN") {
        redirect("/login?redirect=/admin/users");
    }
    
    const params = await searchParams;
    const role = params.role;
    const status = params.status;
    const verified = params.verified;
    const search = params.search;
    const sort = params.sort || "newest";
    const page = params.page ? parseInt(params.page) : 1;
    
    const result = await getAllUsers({ role, status, verified, search, sort, page });
    const users = result.error ? [] : result.data?.users || [];
    const stats = result.data?.stats || {
        total: 0,
        customers: 0,
        sellers: 0,
        admins: 0,
        active: 0,
        banned: 0,
        verified: 0,
        unverified: 0
    };
    const pagination = result.data?.pagination;
    
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