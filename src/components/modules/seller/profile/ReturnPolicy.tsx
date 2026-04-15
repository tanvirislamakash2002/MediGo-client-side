"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Edit, Save, X } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface ReturnPolicyProps {
    policy?: {
        allowed?: boolean;
        days?: number;
        message?: string;
    };
}

export function ReturnPolicy({ policy = {} }: ReturnPolicyProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        allowed: policy.allowed ?? true,
        days: policy.days ?? 7,
        message: policy.message ?? "Items can be returned within 7 days of delivery. Items must be unused and in original packaging."
    });

    const handleSubmit = async () => {
        // Validate days
        if (formData.days < 1) {
            toast.error("Return days must be at least 1");
            return;
        }
        
        if (formData.days > 90) {
            toast.error("Return days cannot exceed 90");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating return policy...");
        
        try {
            const result = await sellerProfile.updateReturnPolicy(formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Return policy updated", { id: toastId });
                setIsEditing(false);
            }
        } catch (error) {
            toast.error("Failed to update policy", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Return & Refund Policy</CardTitle>
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
                        <p className="font-medium">Enable Returns</p>
                        <p className="text-xs text-muted-foreground">Allow customers to return products</p>
                    </div>
                    {isEditing ? (
                        <Switch
                            checked={formData.allowed}
                            onCheckedChange={(checked) => updateField("allowed", checked)}
                        />
                    ) : (
                        <div className="text-muted-foreground">
                            {formData.allowed ? "Enabled" : "Disabled"}
                        </div>
                    )}
                </div>

                {formData.allowed && (
                    <>
                        <div className="flex items-center justify-between py-2 border-b">
                            <div>
                                <p className="font-medium">Return Window</p>
                                <p className="text-xs text-muted-foreground">Days to return after delivery</p>
                            </div>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="90"
                                        value={formData.days}
                                        onChange={(e) => updateField("days", parseInt(e.target.value))}
                                        className="w-20"
                                    />
                                    <span>days</span>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">{formData.days} days</div>
                            )}
                        </div>

                        <div>
                            <Label>Policy Message</Label>
                            {isEditing ? (
                                <>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => updateField("message", e.target.value)}
                                        rows={4}
                                        className="mt-1"
                                        placeholder="Describe your return policy..."
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        This message will be shown to customers during checkout
                                    </p>
                                </>
                            ) : (
                                <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm whitespace-pre-line">
                                        {formData.message || "No policy text provided"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {!formData.allowed && (
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                            Returns are currently disabled. Enable returns to allow customers to return products.
                        </p>
                    </div>
                )}

                {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Policy"}
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