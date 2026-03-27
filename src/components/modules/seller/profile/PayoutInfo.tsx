"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, Building, CreditCard, Smartphone, User } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface PayoutInfoProps {
    payout?: {
        bankName?: string;
        accountHolder?: string;
        accountNumber?: string;
        routingNumber?: string;
        bankAddress?: string;
        mobileMoney?: string;
    } | null;
}

export function PayoutInfo({ payout = null }: PayoutInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Handle null payout by providing default empty object
    const payoutData = payout || {};
    
    const [formData, setFormData] = useState({
        bankName: payoutData.bankName || "",
        accountHolder: payoutData.accountHolder || "",
        accountNumber: payoutData.accountNumber || "",
        routingNumber: payoutData.routingNumber || "",
        bankAddress: payoutData.bankAddress || "",
        mobileMoney: payoutData.mobileMoney || "",
    });


    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.accountHolder) {
            toast.error("Account holder name is required");
            return;
        }
        
        if (!formData.bankName) {
            toast.error("Bank name is required");
            return;
        }
        
        if (!formData.accountNumber) {
            toast.error("Account number is required");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Updating payout information...");
        
        try {
            const result = await sellerProfile.updatePayoutInfo(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Payout information updated", { id: toastId });
                setIsEditing(false);
                // Refresh the page to show updated data
                window.location.reload();
            }
        } catch (error) {
            toast.error("Failed to update information", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Mask account number for display
    const maskAccountNumber = (number: string) => {
        if (!number) return "Not provided";
        if (number.length <= 4) return "••••";
        return `••••${number.slice(-4)}`;
    };

    // Mask routing number for display
    const maskRoutingNumber = (number: string) => {
        if (!number) return "Not provided";
        if (number.length <= 4) return "••••";
        return `••••${number.slice(-4)}`;
    };

    // Check if there's any payout info saved
    const hasPayoutInfo = formData.accountHolder || formData.bankName || formData.accountNumber;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payout Information</CardTitle>
                {!isEditing && hasPayoutInfo && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Show edit form when editing, regardless of existing data */}
                {isEditing ? (
                    // Edit Form - Always show when editing
                    <>
                        <div>
                            <Label>Account Holder Name *</Label>
                            <Input
                                value={formData.accountHolder}
                                onChange={(e) => updateField("accountHolder", e.target.value)}
                                placeholder="Enter account holder name"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Bank Name *</Label>
                            <Input
                                value={formData.bankName}
                                onChange={(e) => updateField("bankName", e.target.value)}
                                placeholder="Enter bank name"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Account Number *</Label>
                            <Input
                                value={formData.accountNumber}
                                onChange={(e) => updateField("accountNumber", e.target.value)}
                                placeholder="Enter account number"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Routing Number</Label>
                            <Input
                                value={formData.routingNumber}
                                onChange={(e) => updateField("routingNumber", e.target.value)}
                                placeholder="Enter routing number"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Bank Address</Label>
                            <Input
                                value={formData.bankAddress}
                                onChange={(e) => updateField("bankAddress", e.target.value)}
                                placeholder="Enter bank address"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Mobile Money (bKash/Nagad)</Label>
                            <Input
                                value={formData.mobileMoney}
                                onChange={(e) => updateField("mobileMoney", e.target.value)}
                                placeholder="e.g., 01XXXXXXXXX"
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                * Required fields. Your payout information is encrypted and secure.
                            </p>
                            <div className="flex gap-3">
                                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSubmitting ? "Saving..." : hasPayoutInfo ? "Save Information" : "Add Information"}
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </>
                ) : hasPayoutInfo ? (
                    // Show payout info if exists and not editing
                    <>
                        <div>
                            <Label>Account Holder Name *</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p>{formData.accountHolder}</p>
                            </div>
                        </div>

                        <div>
                            <Label>Bank Name *</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <p>{formData.bankName}</p>
                            </div>
                        </div>

                        <div>
                            <Label>Account Number *</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <p>{maskAccountNumber(formData.accountNumber)}</p>
                            </div>
                        </div>

                        <div>
                            <Label>Routing Number</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <p>{maskRoutingNumber(formData.routingNumber)}</p>
                            </div>
                        </div>

                        <div>
                            <Label>Bank Address</Label>
                            <p className="mt-1 text-muted-foreground">
                                {formData.bankAddress || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <Label>Mobile Money (bKash/Nagad)</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <p>{formData.mobileMoney || "Not provided"}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    // Show empty state when no payout info exists and not editing
                    <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No payout information added yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Add your bank details to receive payouts
                        </p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => setIsEditing(true)}
                        >
                            Add Payout Information
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}