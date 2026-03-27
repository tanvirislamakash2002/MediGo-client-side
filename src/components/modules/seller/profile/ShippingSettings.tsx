"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, Truck } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface ShippingSettingsProps {
    shipping?: {
        freeShippingThreshold?: number;
        shippingFee?: number;
        estimatedDelivery?: string;
    };
}

export function ShippingSettings({ shipping = {} }: ShippingSettingsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        freeShippingThreshold: shipping.freeShippingThreshold ?? 500,
        shippingFee: shipping.shippingFee ?? 50,
        estimatedDelivery: shipping.estimatedDelivery ?? "3-5 business days"
    });

    const handleSubmit = async () => {
        // Validate fields
        if (formData.freeShippingThreshold < 0) {
            toast.error("Free shipping threshold cannot be negative");
            return;
        }
        
        if (formData.shippingFee < 0) {
            toast.error("Shipping fee cannot be negative");
            return;
        }
        
        if (!formData.estimatedDelivery.trim()) {
            toast.error("Estimated delivery time is required");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating shipping settings...");
        
        try {
            const result = await sellerProfile.updateShippingSettings(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Shipping settings updated", { id: toastId });
                setIsEditing(false);
            }
        } catch (error) {
            toast.error("Failed to update settings", { id: toastId });
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
                <CardTitle>Shipping Settings</CardTitle>
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
                        <p className="font-medium">Free Shipping Threshold</p>
                        <p className="text-xs text-muted-foreground">
                            Orders over this amount get free shipping
                        </p>
                    </div>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                                type="number"
                                min="0"
                                step="10"
                                value={formData.freeShippingThreshold}
                                onChange={(e) => updateField("freeShippingThreshold", parseFloat(e.target.value) || 0)}
                                className="w-28"
                            />
                        </div>
                    ) : (
                        <div className="text-muted-foreground font-medium">
                            ${formData.freeShippingThreshold}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                    <div>
                        <p className="font-medium">Standard Shipping Fee</p>
                        <p className="text-xs text-muted-foreground">
                            Base shipping cost per order
                        </p>
                    </div>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                                type="number"
                                min="0"
                                step="5"
                                value={formData.shippingFee}
                                onChange={(e) => updateField("shippingFee", parseFloat(e.target.value) || 0)}
                                className="w-28"
                            />
                        </div>
                    ) : (
                        <div className="text-muted-foreground font-medium">
                            ${formData.shippingFee}
                        </div>
                    )}
                </div>

                <div className="py-2 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="font-medium">Estimated Delivery Time</p>
                            <p className="text-xs text-muted-foreground">
                                Estimated delivery time after shipping
                            </p>
                        </div>
                        {isEditing && (
                            <span className="text-xs text-muted-foreground">e.g., "3-5 business days"</span>
                        )}
                    </div>
                    {isEditing ? (
                        <Input
                            value={formData.estimatedDelivery}
                            onChange={(e) => updateField("estimatedDelivery", e.target.value)}
                            placeholder="3-5 business days"
                            className="mt-1"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            <span>{formData.estimatedDelivery}</span>
                        </div>
                    )}
                </div>

                <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        💡 Free shipping applies when order total exceeds ${formData.freeShippingThreshold}.
                        Standard shipping fee of ${formData.shippingFee} applies to orders below this amount.
                    </p>
                </div>

                {isEditing && (
                    <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Settings"}
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