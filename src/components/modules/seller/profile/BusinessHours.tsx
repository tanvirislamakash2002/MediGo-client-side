"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Save, X } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface BusinessHoursProps {
    hours?: {
        monday?: { open?: string; close?: string; closed?: boolean };
        tuesday?: { open?: string; close?: string; closed?: boolean };
        wednesday?: { open?: string; close?: string; closed?: boolean };
        thursday?: { open?: string; close?: string; closed?: boolean };
        friday?: { open?: string; close?: string; closed?: boolean };
        saturday?: { open?: string; close?: string; closed?: boolean };
        sunday?: { open?: string; close?: string; closed?: boolean };
    };
}

interface FormData {
    monday: { start: string; end: string; open: boolean };
    tuesday: { start: string; end: string; open: boolean };
    wednesday: { start: string; end: string; open: boolean };
    thursday: { start: string; end: string; open: boolean };
    friday: { start: string; end: string; open: boolean };
    saturday: { start: string; end: string; open: boolean };
    sunday: { start: string; end: string; open: boolean };
}

const days: { key: keyof FormData; label: string }[] = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
];

// Helper to format business hours for the component
const formatHours = (hours: any): FormData => {
    const defaultDay = { open: "09:00", close: "18:00", closed: false };
    
    return days.reduce((acc, day) => {
        const dayData = hours?.[day.key] || defaultDay;
        acc[day.key] = {
            start: dayData.open || "09:00",
            end: dayData.close || "18:00",
            open: !dayData.closed
        };
        return acc;
    }, {} as FormData);
};

// Helper to format hours back to backend format
const formatForBackend = (formData: FormData) => {
    return days.reduce((acc, day) => {
        const dayData = formData[day.key];
        acc[day.key] = {
            open: dayData.start,
            close: dayData.end,
            closed: !dayData.open
        };
        return acc;
    }, {} as any);
};

export function BusinessHours({ hours }: BusinessHoursProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>(() => formatHours(hours));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating business hours...");
        
        try {
            const backendData = formatForBackend(formData);
            const result = await sellerProfile.updateBusinessHours(backendData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Business hours updated", { id: toastId });
                setIsEditing(false);
            }
        } catch (error) {
            toast.error("Failed to update hours", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateDay = (day: keyof FormData, field: keyof FormData[keyof FormData], value: any) => {
        setFormData((prev: FormData) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Business Hours</CardTitle>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {days.map((day) => (
                        <div key={day.key} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="w-24 font-medium">{day.label}</div>
                            {isEditing ? (
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={formData[day.key].open}
                                        onCheckedChange={(checked) => updateDay(day.key, "open", checked)}
                                    />
                                    {formData[day.key].open && (
                                        <>
                                            <input
                                                type="time"
                                                value={formData[day.key].start}
                                                onChange={(e) => updateDay(day.key, "start", e.target.value)}
                                                className="px-2 py-1 border rounded"
                                            />
                                            <span>-</span>
                                            <input
                                                type="time"
                                                value={formData[day.key].end}
                                                onChange={(e) => updateDay(day.key, "end", e.target.value)}
                                                className="px-2 py-1 border rounded"
                                            />
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">
                                    {formData[day.key].open ? (
                                        `${formData[day.key].start} - ${formData[day.key].end}`
                                    ) : (
                                        "Closed"
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {isEditing && (
                    <div className="flex gap-3 mt-4 pt-4 border-t">
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Hours"}
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