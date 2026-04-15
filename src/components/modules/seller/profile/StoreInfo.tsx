"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X, Camera, Loader2 } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface StoreInfoProps {
    store: {
        storeName: string;
        storeDescription?: string;
        email: string;
        phone: string;
        address?: string;
        website?: string;
        storeLogo?: string | null;
        banner?: string;
        rating?: number;
        totalReviews?: number;
        createdAt?: string;
        verificationStatus?: string;
        businessHours?: any;
        shippingSettings?: any;
        returnPolicy?: any;
        notificationPreferences?: any;
        isActive?: boolean;
        isPaused?: boolean;
    };
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function StoreInfo({ store }: StoreInfoProps) {
    const router = useRouter();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [formData, setFormData] = useState({
        name: store.storeName,
        description: store.storeDescription || "",
        email: store.email,
        phone: store.phone,
        address: store.address || "",
        website: store.website || "",
    });
    const [logoUrl, setLogoUrl] = useState<string | null>(store.storeLogo || null);
    const [bannerUrl, setBannerUrl] = useState<string | null>(store.banner || null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating store information...");
        
        try {
            const result = await sellerProfile.updateStoreInfo({
                storeName: formData.name,
                storeDescription: formData.description
            });
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Store information updated", { id: toastId });
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update store", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        setIsUploadingLogo(true);
        const toastId = toast.loading("Uploading logo...");

        try {
            const formData = new FormData();
            formData.append("logo", file);
            const result = await sellerProfile.uploadStoreLogo(formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Logo uploaded", { id: toastId });
                setLogoUrl(result.data.url);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to upload logo", { id: toastId });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        setIsUploadingBanner(true);
        const toastId = toast.loading("Uploading banner...");

        try {
            const formData = new FormData();
            formData.append("banner", file);
            const result = await sellerProfile.uploadStoreLogo(formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Banner uploaded", { id: toastId });
                setBannerUrl(result.data.url);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to upload banner", { id: toastId });
        } finally {
            setIsUploadingBanner(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recently";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return "Recently";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Store Information</CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Store Banner */}
                <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                    {bannerUrl ? (
                        <Image src={bannerUrl} alt="Store banner" fill className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Store Banner
                        </div>
                    )}
                    <button
                        onClick={() => bannerInputRef.current?.click()}
                        className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
                        disabled={isUploadingBanner}
                    >
                        {isUploadingBanner ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="h-4 w-4" />
                        )}
                    </button>
                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                    />
                </div>

                {/* Store Logo */}
                <div className="flex justify-center -mt-12">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={logoUrl || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                {getInitials(store.storeName)}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => logoInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full text-primary-foreground shadow-md hover:bg-primary/90"
                            disabled={isUploadingLogo}
                        >
                            {isUploadingLogo ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="h-4 w-4" />
                            )}
                        </button>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Store Stats - Show only if rating exists */}
                {store.rating !== undefined && (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{store.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({store.totalReviews || 0} reviews)</span>
                        </div>
                    </div>
                )}

                {/* Store Status */}
                <div className="text-center space-y-1">
                    {store.createdAt && (
                        <p className="text-xs text-muted-foreground">
                            Active since {formatDate(store.createdAt)}
                        </p>
                    )}
                    <div className="flex items-center justify-center gap-2">
                        {store.isActive !== undefined && (
                            <p className={`text-xs ${store.isActive && !store.isPaused ? "text-green-600" : "text-red-600"}`}>
                                {store.isPaused ? "✓ Store Paused" : store.isActive ? "✓ Store Active" : "✗ Store Closed"}
                            </p>
                        )}
                        {store.verificationStatus && (
                            <p className="text-xs text-green-600">✓ {store.verificationStatus}</p>
                        )}
                    </div>
                </div>

                {/* Store Fields */}
                <div className="space-y-4">
                    <div>
                        <Label>Store Name</Label>
                        {isEditing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="text-lg font-semibold mt-1">{store.storeName}</p>
                        )}
                    </div>

                    <div>
                        <Label>Store Description</Label>
                        {isEditing ? (
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="mt-1"
                            />
                        ) : (
                            <p className="text-muted-foreground mt-1">{store.storeDescription || "No description provided"}</p>
                        )}
                    </div>

                    <div>
                        <Label>Store Email</Label>
                        {isEditing ? (
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1">{store.email}</p>
                        )}
                    </div>

                    <div>
                        <Label>Store Phone</Label>
                        {isEditing ? (
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1">{store.phone}</p>
                        )}
                    </div>

                    <div>
                        <Label>Store Address</Label>
                        {isEditing ? (
                            <Textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={2}
                                className="mt-1"
                            />
                        ) : (
                            <p className="mt-1 whitespace-pre-line">{store.address || "No address provided"}</p>
                        )}
                    </div>

                    <div>
                        <Label>Website (Optional)</Label>
                        {isEditing ? (
                            <Input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://yourstore.com"
                                className="mt-1"
                            />
                        ) : (
                            store.website && (
                                <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 block">
                                    {store.website}
                                </a>
                            )
                        )}
                    </div>
                </div>

                {/* Edit Actions */}
                {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}