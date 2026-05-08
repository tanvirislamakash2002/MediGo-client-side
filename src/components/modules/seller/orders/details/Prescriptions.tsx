"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Pill } from "lucide-react";
import { toast } from "sonner";

interface Prescription {
    id: string;
    imageUrl: string;
    createdAt: string;
}

interface PrescriptionsProps {
    prescriptions: Prescription[];
}

const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try { new URL(url); return true; }
    catch { return false; }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function Prescriptions({ prescriptions }: PrescriptionsProps) {
    if (!prescriptions || prescriptions.length === 0) {
        return null;
    }

    const handleViewPrescription = (url: string) => {
        window.open(url, '_blank');
    };

    const handleDownloadPrescription = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success("Prescription downloaded");
        } catch (error) {
            toast.error("Failed to download prescription");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Prescriptions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        This order contains prescription medicines. Please verify the uploaded prescriptions before shipping.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prescriptions.map((prescription, index) => (
                        <div key={prescription.id} className="border rounded-lg overflow-hidden">
                            <div className="relative h-40 bg-muted">
                                {isValidUrl(prescription.imageUrl) ? (
                                    <Image
                                        src={prescription.imageUrl}
                                        alt={`Prescription ${index + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Pill className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Uploaded on {formatDate(prescription.createdAt)}
                                    </p>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewPrescription(prescription.imageUrl)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadPrescription(
                                                prescription.imageUrl, 
                                                `prescription-${prescription.id.slice(0, 8)}.jpg`
                                            )}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}