"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, Mail, Phone, User, Camera, Loader2 } from "lucide-react";
import { customerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface PersonalInfoProps {
    profile: {
        id: string;
        name: string;
        email: string;
        phone: string;
        image?: string;
        createdAt: string;
    } | null;
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function PersonalInfo({ profile }: PersonalInfoProps) {
    const router = useRouter();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState({
        name: profile?.name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
    });
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.image || null);

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating personal information...");
        
        try {
            const result = await customerProfile.updateCustomerProfile(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Personal information updated", { id: toastId });
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update information", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setIsUploadingAvatar(true);
        const toastId = toast.loading("Uploading avatar...");

        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const result = await customerProfile.customerUploadAvatar(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Avatar uploaded", { id: toastId });
                setAvatarUrl(result.data.url);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to upload avatar", { id: toastId });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    if (!profile) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-center">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarUrl || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full text-primary-foreground shadow-md hover:bg-primary/90"
                            disabled={isUploadingAvatar}
                        >
                            {isUploadingAvatar ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Camera className="h-3 w-3" />
                            )}
                        </button>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                <div>
                    <Label>Full Name *</Label>
                    {isEditing ? (
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                            maxLength={100}
                            className="mt-1"
                        />
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p>{profile.name}</p>
                        </div>
                    )}
                </div>

                <div>
                    <Label>Email Address *</Label>
                    {isEditing ? (
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1"
                        />
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p>{profile.email}</p>
                        </div>
                    )}
                </div>

                <div>
                    <Label>Phone Number</Label>
                    {isEditing ? (
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.slice(0, 20) })}
                            maxLength={20}
                            placeholder="e.g., +1234567890"
                            className="mt-1"
                        />
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p>{profile.phone || "Not provided"}</p>
                        </div>
                    )}
                </div>

                <div>
                    <Label>Member Since</Label>
                    <p className="mt-1 text-muted-foreground">
                        {new Date(profile.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

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