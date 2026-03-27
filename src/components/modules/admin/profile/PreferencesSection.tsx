"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { updatePreferences } from "@/actions/profile.action";
import { toast } from "sonner";

interface NotificationSettings {
    newUserRegistration: boolean;
    newOrder: boolean;
    lowStockAlert: boolean;
    systemUpdates: boolean;
    weeklyReport: boolean;
    dailyDigest: boolean;
}

export function PreferencesSection() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notifications, setNotifications] = useState<NotificationSettings>({
        newUserRegistration: true,
        newOrder: true,
        lowStockAlert: true,
        systemUpdates: true,
        weeklyReport: false,
        dailyDigest: false,
    });

    // Wait for client-side mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSave = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving preferences...");
        
        try {
            const result = await updatePreferences({ notifications, theme: theme || "light" });
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Preferences saved successfully", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to save preferences", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render theme-dependent content until mounted
    if (!mounted) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="h-24" /> {/* Placeholder to maintain layout */}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Theme Preference */}
                <div>
                    <h3 className="text-sm font-medium mb-3">Display Theme</h3>
                    <div className="flex gap-3">
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            onClick={() => setTheme("light")}
                            className="flex-1"
                        >
                            Light
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            onClick={() => setTheme("dark")}
                            className="flex-1"
                        >
                            Dark
                        </Button>
                        <Button
                            variant={theme === "system" ? "default" : "outline"}
                            onClick={() => setTheme("system")}
                            className="flex-1"
                        >
                            System
                        </Button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium">Notification Preferences</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="new-user">New User Registration</Label>
                            <Switch
                                id="new-user"
                                checked={notifications.newUserRegistration}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, newUserRegistration: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="new-order">New Order</Label>
                            <Switch
                                id="new-order"
                                checked={notifications.newOrder}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, newOrder: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="low-stock">Low Stock Alert</Label>
                            <Switch
                                id="low-stock"
                                checked={notifications.lowStockAlert}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, lowStockAlert: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="system-updates">System Updates</Label>
                            <Switch
                                id="system-updates"
                                checked={notifications.systemUpdates}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, systemUpdates: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="weekly-report">Weekly Report</Label>
                            <Switch
                                id="weekly-report"
                                checked={notifications.weeklyReport}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, weeklyReport: checked })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="daily-digest">Daily Digest</Label>
                            <Switch
                                id="daily-digest"
                                checked={notifications.dailyDigest}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, dailyDigest: checked })
                                }
                            />
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Saving..." : "Save Preferences"}
                </Button>
            </CardContent>
        </Card>
    );
}