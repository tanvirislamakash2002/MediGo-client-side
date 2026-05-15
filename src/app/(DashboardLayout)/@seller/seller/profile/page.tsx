import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { sellerProfile } from "@/actions/profile";
import { ProfileHeader } from "@/components/modules/seller/profile/ProfileHeader";
import { StoreInfo } from "@/components/modules/seller/profile/StoreInfo";
import { PersonalInfo } from "@/components/modules/seller/profile/PersonalInfo";
import { BusinessHours } from "@/components/modules/seller/profile/BusinessHours";
import { ShippingSettings } from "@/components/modules/seller/profile/ShippingSettings";
import { ReturnPolicy } from "@/components/modules/seller/profile/ReturnPolicy";
import { PayoutInfo } from "@/components/modules/seller/profile/PayoutInfo";
import { NotificationPrefs } from "@/components/modules/seller/profile/NotificationPrefs";
import { SecuritySection } from "@/components/modules/seller/profile/SecuritySection";
import { StorePerformance } from "@/components/modules/seller/profile/StorePerformance";
import { DangerZone } from "@/components/modules/seller/profile/DangerZone";

export default async function SellerProfilePage() {
    const { data: session, success } = await getSession();
    
    if (!success || !session || session.user.role !== "SELLER") {
        redirect("/login?redirect=/seller/profile");
    }
    
    const profileResult = await sellerProfile.getSellerProfile();
    const settingsResult = await sellerProfile.getSellerStoreSettings();
    
    const profile = !profileResult.success ? null : profileResult.data;
    const settings = !settingsResult.success ? null : settingsResult.data;
    
    // Add default values for missing data
    const settingsWithDefaults = settings ? {
        ...settings,
        documents: settings.documents || [],
        performance: settings.performance || {
            rating: 0,
            totalReviews: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalSales: 0,
            completionRate: 100,
            responseTime: "24 hours",
            satisfactionRate: 0
        }
    } : null;
    
    return (
        <div className="space-y-6">
            <ProfileHeader sellerName={session.user.name} />
            
            {profile && settingsWithDefaults && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <StoreInfo store={settingsWithDefaults} />
                        <PersonalInfo profile={profile} />
                        <BusinessHours hours={settingsWithDefaults.businessHours} />
                    </div>
                    
                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <ShippingSettings shipping={settingsWithDefaults.shippingSettings} />
                        <ReturnPolicy policy={settingsWithDefaults.returnPolicy} />
                        <PayoutInfo payout={settingsWithDefaults.payoutInfo} />
                        <NotificationPrefs preferences={settingsWithDefaults.notificationPreferences} />
                        <SecuritySection />
                        <StorePerformance performance={settingsWithDefaults.performance} />
                        <DangerZone />
                    </div>
                </div>
            )}
        </div>
    );
}