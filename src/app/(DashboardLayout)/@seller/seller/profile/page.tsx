import { Suspense } from "react";
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
import { DocumentVerification } from "@/components/modules/seller/profile/DocumentVerification";
import { DangerZone } from "@/components/modules/seller/profile/DangerZone";
import { ProfileSkeleton } from "@/components/modules/seller/profile/ProfileSkeleton";

export default async function SellerProfilePage() {
    const { data: session, error: sessionError } = await getSession();
        
    const profileResult = await sellerProfile.getSellerProfile();
    const settingsResult = await sellerProfile.getSellerStoreSettings();
    
    const profile = profileResult.error ? null : profileResult.data;
    const settings = settingsResult.error ? null : settingsResult.data;
    
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
    
    console.log('object---------------', settingsWithDefaults.payoutInfo);
    
    return (
        <div className="space-y-6">
            <ProfileHeader sellerName={session.user.name} />
            
            <Suspense fallback={<ProfileSkeleton />}>
                {profile && settingsWithDefaults && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <StoreInfo store={settingsWithDefaults} />
                            <PersonalInfo profile={profile} />
                            <BusinessHours hours={settingsWithDefaults.businessHours} />
                            <DocumentVerification documents={settingsWithDefaults.documents} />
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
            </Suspense>
        </div>
    );
}