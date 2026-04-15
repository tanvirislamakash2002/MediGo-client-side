"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, Mail, Phone, User } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface PersonalInfoProps {
    profile: {
        id: string;
        name: string;
        email: string;
        phone: string;
        image?: string;
        createdAt: string;
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

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

export function PersonalInfo({ profile }: PersonalInfoProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
    });

    const handleSubmit = async () => {
        // Validate name
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        // Validate email
        if (!validateEmail(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Validate phone (optional)
        if (formData.phone && !validatePhone(formData.phone)) {
            toast.error("Please enter a valid phone number");
            return;
        }

        // Confirm email change
        if (formData.email !== profile.email) {
            const confirmed = window.confirm(
                "Changing your email will require re-verification. You will need to verify your new email address. Continue?"
            );
            if (!confirmed) return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating personal information...");
        
        try {
            const result = await sellerProfile.updatePersonalInfo(formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
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
                {/* Avatar */}
                <div className="flex justify-center">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {getInitials(profile.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div>
                    <Label>Full Name *</Label>
                    {isEditing ? (
                        <>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })}
                                maxLength={100}
                                placeholder="Enter your full name"
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                This name will appear on your store profile
                            </p>
                        </>
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
                            placeholder="Enter your email address"
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
                        <>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.slice(0, 20) })}
                                maxLength={20}
                                placeholder="e.g., +1234567890"
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Include country code for international numbers
                            </p>
                        </>
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