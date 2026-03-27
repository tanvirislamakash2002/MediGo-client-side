import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { ProfileHeader } from "@/components/modules/admin/profile/ProfileHeader";
import { ProfileInfo } from "@/components/modules/admin/profile/ProfileInfo";
import { SecuritySection } from "@/components/modules/admin/profile/SecuritySection";
import { PreferencesSection } from "@/components/modules/admin/profile/PreferencesSection";
import { ActivityLogSection } from "@/components/modules/admin/profile/ActivityLogSection";
import { DangerZone } from "@/components/modules/admin/profile/DangerZone";
import { ProfileSkeleton } from "@/components/modules/admin/profile/ProfileSkeleton";
import { adminProfile } from "@/actions/profile";

export default async function AdminProfilePage() {
    const { data: session, error: sessionError } = await getSession();
    
    if (sessionError || !session || session.user.role !== "ADMIN") {
        redirect("/login?redirect=/admin/profile");
    }
    
    const profileResult = await adminProfile.getAdminProfile();
    const logsResult = await adminProfile.getAdminActivityLogs();
    
    const profile = profileResult.error ? null : profileResult.data;
    const activityLogs = logsResult.error ? [] : logsResult.data;
    console.log(profileResult);
    return (
        <div className="space-y-6">
            <ProfileHeader adminName={session.user.name} />
            
            <Suspense fallback={<ProfileSkeleton />}>
                {profile && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <ProfileInfo profile={profile} />
                        </div>
                        
                        {/* Right Column - Security & Preferences */}
                        <div className="lg:col-span-2 space-y-6">
                            <SecuritySection />
                            <PreferencesSection />
                            <ActivityLogSection logs={activityLogs} />
                            <DangerZone />
                        </div>
                    </div>
                )}
            </Suspense>
        </div>
    );
}