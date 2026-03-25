import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { Roles } from "@/constants/roles";
import { DashboardHeader } from "@/components/layout/dashboard/dashboard-header";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
    seller,
    admin
}: Readonly<{
    seller: React.ReactNode;
    admin: React.ReactNode;
}>) {
    const { data, error } = await userService.getSession();
    
    // Redirect if not authenticated
    if (error || !data?.user) {
        redirect("/login?redirect=/dashboard");
    }
    
    const userInfo = data.user;
    
    // Check if user has permission to access dashboard
    if (userInfo.role !== Roles.seller && userInfo.role !== Roles.admin) {
        redirect("/shop");
    }
    
    return (
        <SidebarProvider>
            <AppSidebar user={userInfo} />
            <SidebarInset>
                <DashboardHeader user={userInfo} />
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                    {userInfo.role === Roles.seller && seller}
                    {userInfo.role === Roles.admin && admin}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}