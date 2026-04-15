import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getDashboardStats } from "@/actions/dashboard.action";
import { DashboardHeader } from "@/components/modules/admin/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/modules/admin/dashboard/MetricsCards";
import { QuickActions } from "@/components/modules/admin/dashboard/QuickActions";
import { ChartsSection } from "@/components/modules/admin/dashboard/ChartsSection";
import { RecentOrders } from "@/components/modules/admin/dashboard/RecentOrders";
import { RecentUsers } from "@/components/modules/admin/dashboard/RecentUsers";
import { AlertsNotifications } from "@/components/modules/admin/dashboard/AlertsNotifications";
import { PlatformStats } from "@/components/modules/admin/dashboard/PlatformStats";
import { TopProducts } from "@/components/modules/admin/dashboard/TopProducts";
import { SellerPerformance } from "@/components/modules/admin/dashboard/SellerPerformance";
import { ActivityFeed } from "@/components/modules/admin/dashboard/ActivityFeed";
import { SystemHealth } from "@/components/modules/admin/dashboard/SystemHealth";
import { DashboardSkeleton } from "@/components/modules/admin/dashboard/DashboardSkeleton";

interface PageProps {
    searchParams: Promise<{
        range?: string;
    }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
    const { data: session, success } = await getSession();
    
    // if (sessionError || !session || session.user.role !== "ADMIN") {
    //     redirect("/login?redirect=/admin/dashboard");
    // }
    
    const params = await searchParams;
    const range = params.range || "week";
    
    const result = await getDashboardStats({ range });
    const stats = !result.success ? null : result.data;
    
    return (
        <div className="space-y-6">
            <DashboardHeader 
                adminName={session.user.name}
                lastLogin={session.user.lastLogin}
            />
            
            <Suspense fallback={<DashboardSkeleton />}>
                {stats && (
                    <>
                        <MetricsCards stats={stats.metrics} />
                        <QuickActions />
                        
                        {/* Fix 1: Remove range prop - ChartsSection doesn't accept it */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ChartsSection 
                                revenueData={stats.revenueData}
                                statusData={stats.orderStatusData}
                            />
                        </div>
                        
                        <RecentOrders orders={stats.recentOrders} />
                        <RecentUsers users={stats.recentUsers} />
                        
                        <AlertsNotifications alerts={stats.alerts} />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PlatformStats stats={stats.platformStats} />
                            <TopProducts products={stats.topProducts} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SellerPerformance sellers={stats.topSellers} />
                            <ActivityFeed activities={stats.recentActivities} />
                        </div>
                        
                        <SystemHealth health={stats.systemHealth} />
                    </>
                )}
            </Suspense>
        </div>
    );
}