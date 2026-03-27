"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Calendar, Edit, Save, X, Camera, Loader2 } from "lucide-react";
import { adminProfile } from "@/actions/profile";
import { toast } from "sonner";

interface Profile {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
    lastLogin?: string;
    image?: string | null;
}

interface ProfileInfoProps {
    profile: Profile;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function ProfileInfo({ profile }: ProfileInfoProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
    });
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.image || null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating profile...");
        
        try {
            const result = await adminProfile.updateAdminProfile(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Profile updated successfully", { id: toastId });
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update profile", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading avatar...");

        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const result = await adminProfile.adminUploadAvatar(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Avatar updated successfully", { id: toastId });
                setAvatarUrl(result.data.url);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to upload avatar", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        const toastId = toast.loading("Removing avatar...");
        
        try {
            const result = await adminProfile.adminUploadAvatar(null); // Pass null to remove
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Avatar removed successfully", { id: toastId });
                setAvatarUrl(null);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to remove avatar", { id: toastId });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar with Upload */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="h-4 w-4" />
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                    {avatarUrl && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            disabled={isUploading}
                            className="text-xs text-muted-foreground"
                        >
                            Remove
                        </Button>
                    )}
                </div>

                {/* Profile Fields */}
                <div className="space-y-4">
                    <div>
                        <Label>Full Name</Label>
                        {isEditing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1"
                            />
                        ) : (
                            <p className="text-lg font-medium mt-1">{profile.name}</p>
                        )}
                    </div>

                    <div>
                        <Label>Email Address</Label>
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
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Not provided"
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
                        <Label>Role</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-red-500">Admin</Badge>
                        </div>
                    </div>

                    <div>
                        <Label>Member Since</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p>{formatDate(profile.createdAt)}</p>
                        </div>
                    </div>

                    {profile.lastLogin && (
                        <div>
                            <Label>Last Login</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                {new Date(profile.lastLogin).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Edit Actions */}
                {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}