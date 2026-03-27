import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { getSellerDashboardStats } from "@/actions/dashboard.action";
import { DashboardHeader } from "@/components/modules/seller/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/modules/seller/dashboard/MetricsCards";
import { QuickActions } from "@/components/modules/seller/dashboard/QuickActions";
import { SalesChart } from "@/components/modules/seller/dashboard/SalesChart";
import { RecentOrders } from "@/components/modules/seller/dashboard/RecentOrders";
import { LowStockAlerts } from "@/components/modules/seller/dashboard/LowStockAlerts";
import { TopProducts } from "@/components/modules/seller/dashboard/TopProducts";
import { RecentReviews } from "@/components/modules/seller/dashboard/RecentReviews";
import { InventorySummary } from "@/components/modules/seller/dashboard/InventorySummary";
import { SalesByCategory } from "@/components/modules/seller/dashboard/SalesByCategory";
import { ActivityFeed } from "@/components/modules/seller/dashboard/ActivityFeed";
import { StorePerformance } from "@/components/modules/seller/dashboard/StorePerformance";
import { TipsRecommendations } from "@/components/modules/seller/dashboard/TipsRecommendations";
import { DashboardSkeleton } from "@/components/modules/seller/dashboard/DashboardSkeleton";

interface PageProps {
    searchParams: Promise<{
        range?: string;
    }>;
}

export default async function SellerDashboardPage({ searchParams }: PageProps) {
    const { data: session, error: sessionError } = await getSession();
    
    if (sessionError || !session || session.user.role !== "SELLER") {
        redirect("/login?redirect=/seller/dashboard");
    }
    
    const params = await searchParams;
    const range = params.range || "week";
    
    const result = await getSellerDashboardStats({ range });
    const stats = result.error ? null : result.data;
    console.log(stats);
    return (
        <div className="space-y-6">
            <DashboardHeader 
                sellerName={session.user.name}
                storeName={session.user.storeName || "My Store"}
            />
            
            <Suspense fallback={<DashboardSkeleton />}>
                {stats && (
                    <>
                        <MetricsCards stats={stats.metrics} />
                        <QuickActions />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SalesChart 
                                salesData={stats.salesData}
                                range={range}
                            />
                            <SalesByCategory 
                                categoryData={stats.categorySales}
                            />
                        </div>
                        
                        <RecentOrders orders={stats.recentOrders} />
                        <LowStockAlerts products={stats.lowStockProducts} />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TopProducts products={stats.topProducts} />
                            <RecentReviews reviews={stats.recentReviews} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <InventorySummary summary={stats.inventorySummary} />
                            <StorePerformance performance={stats.storePerformance} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ActivityFeed activities={stats.recentActivities} />
                            <TipsRecommendations tips={stats.recommendations} />
                        </div>
                    </>
                )}
            </Suspense>
        </div>
    );
}