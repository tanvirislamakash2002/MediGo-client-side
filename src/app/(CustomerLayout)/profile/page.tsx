import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth.action";
import { customerProfile } from "@/actions/profile";
import { ProfileHeader } from "@/components/modules/customer/profile/ProfileHeader";
import { PersonalInfo } from "@/components/modules/customer/profile/PersonalInfo";
import { AddressBook } from "@/components/modules/customer/profile/AddressBook";
import { OrderSummary } from "@/components/modules/customer/profile/OrderSummary";
import { SecuritySection } from "@/components/modules/customer/profile/SecuritySection";
import { NotificationPrefs } from "@/components/modules/customer/profile/NotificationPrefs";
import { WishlistSummary } from "@/components/modules/customer/profile/WishlistSummary";
import { RecentReviews } from "@/components/modules/customer/profile/RecentReviews";
import { DangerZone } from "@/components/modules/customer/profile/DangerZone";
import { ProfileSkeleton } from "@/components/modules/customer/profile/ProfileSkeleton";

export default async function CustomerProfilePage() {
    const { data: session, error: sessionError } = await getSession();
    
    if (sessionError || !session || session.user.role !== "CUSTOMER") {
        redirect("/login?redirect=/customer/profile");
    }
    
    const profileResult = await customerProfile.getCustomerProfile();
    const addressesResult = await customerProfile.getCustomerAddresses();
    const ordersResult = await customerProfile.getCustomerOrders();
    const wishlistResult = await customerProfile.getCustomerWishlist();
    const reviewsResult = await customerProfile.getCustomerReviews();
    
    const profile = profileResult.error ? null : profileResult.data;
    const addresses = addressesResult.error ? [] : addressesResult.data;
    const orders = ordersResult.error ? [] : ordersResult.data;
    const wishlist = wishlistResult.error ? [] : wishlistResult.data;
    const reviews = reviewsResult.error ? [] : reviewsResult.data;
    
    const settingsWithDefaults = profile ? {
        ...profile,
        addresses: addresses,
        orders: orders,
        wishlist: wishlist,
        reviews: reviews
    } : null;
    console.log('object1-----------------',profileResult);
    return (
        <div className="space-y-6">
            <ProfileHeader customerName={session.user.name} />
            
            <Suspense fallback={<ProfileSkeleton />}>
                {settingsWithDefaults && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <PersonalInfo profile={profile} />
                            <AddressBook addresses={addresses} />
                            <OrderSummary orders={orders} />
                        </div>
                        
                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <SecuritySection />
                            <NotificationPrefs />
                            <WishlistSummary wishlist={wishlist} />
                            <RecentReviews reviews={reviews} />
                            <DangerZone />
                        </div>
                    </div>
                )}
            </Suspense>
        </div>
    );
}