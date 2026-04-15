"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";
import { customerProfile } from "@/actions/profile";
import { toast } from "sonner";

export function NotificationPrefs() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        orderUpdates: true,
        promotionalEmails: false,
        smsNotifications: false,
        productAlerts: true,
    });

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating notification preferences...");
        
        try {
            const result = await customerProfile.updateNotificationPreferences(formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
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
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                    <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-xs text-muted-foreground">
                            Receive notifications about your order status
                        </p>
                    </div>
                    <Switch
                        checked={formData.orderUpdates}
                        onCheckedChange={(checked) => updateField("orderUpdates", checked)}
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <div>
                        <p className="font-medium">Promotional Emails</p>
                        <p className="text-xs text-muted-foreground">
                            Get offers, deals, and new product alerts
                        </p>
                    </div>
                    <Switch
                        checked={formData.promotionalEmails}
                        onCheckedChange={(checked) => updateField("promotionalEmails", checked)}
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-xs text-muted-foreground">
                            Receive text messages for important updates
                        </p>
                    </div>
                    <Switch
                        checked={formData.smsNotifications}
                        onCheckedChange={(checked) => updateField("smsNotifications", checked)}
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <div>
                        <p className="font-medium">Product Alerts</p>
                        <p className="text-xs text-muted-foreground">
                            Get notified when wishlist items are back in stock
                        </p>
                    </div>
                    <Switch
                        checked={formData.productAlerts}
                        onCheckedChange={(checked) => updateField("productAlerts", checked)}
                        disabled={!isEditing}
                    />
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