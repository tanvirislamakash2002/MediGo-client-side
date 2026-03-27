"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface NotificationPrefsProps {
    preferences?: {
        email?: boolean;
        sms?: boolean;
        newOrder?: boolean;
        orderUpdate?: boolean;
        lowStock?: boolean;
    };
}

export function NotificationPrefs({ preferences = {} }: NotificationPrefsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: preferences.email ?? true,
        sms: preferences.sms ?? false,
        newOrder: preferences.newOrder ?? true,
        orderUpdate: preferences.orderUpdate ?? true,
        lowStock: preferences.lowStock ?? true,
    });

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating notification preferences...");
        
        try {
            const result = await sellerProfile.updateNotificationPreferences(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Preferences updated", { id: toastId });
                setIsEditing(false);
            }
        } catch (error) {
            toast.error("Failed to update preferences", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notification Preferences</CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-medium mb-3">Notification Channels</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Email Notifications</Label>
                            <Switch
                                checked={formData.email}
                                onCheckedChange={(checked) => updateField("email", checked)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>SMS Notifications</Label>
                            <Switch
                                checked={formData.sms}
                                onCheckedChange={(checked) => updateField("sms", checked)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3">Event Notifications</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>New Order</Label>
                            <Switch
                                checked={formData.newOrder}
                                onCheckedChange={(checked) => updateField("newOrder", checked)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Order Status Update</Label>
                            <Switch
                                checked={formData.orderUpdate}
                                onCheckedChange={(checked) => updateField("orderUpdate", checked)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Low Stock Alert</Label>
                            <Switch
                                checked={formData.lowStock}
                                onCheckedChange={(checked) => updateField("lowStock", checked)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <p>💡 Note: SMS notifications require a verified phone number.</p>
                </div>

                {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Preferences"}
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