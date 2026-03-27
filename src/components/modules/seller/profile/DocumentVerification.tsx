"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, XCircle, Eye, Trash2, Loader2 } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
import { toast } from "sonner";

interface Document {
    id: string;
    documentType?: string;  // Backend uses documentType
    name?: string;          // If name isn't provided, use documentType
    type?: string;          // Alternative field
    uploadedAt?: string;    // Backend uses uploadedAt
    createdAt?: string;     // Alternative field
    status?: "pending" | "verified" | "rejected";
    documentUrl?: string;   // Backend uses documentUrl
    url?: string;           // Alternative field
}

interface DocumentVerificationProps {
    documents?: Document[];  // Make it optional
}

export function DocumentVerification({ documents = [] }: DocumentVerificationProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Helper to get document name
    const getDocumentName = (doc: Document): string => {
        return doc.name || doc.documentType || "Document";
    };

    // Helper to get document URL
    const getDocumentUrl = (doc: Document): string => {
        return doc.url || doc.documentUrl || "#";
    };

    // Helper to get upload date
    const getUploadDate = (doc: Document): string => {
        const date = doc.uploadedAt || doc.createdAt;
        return date ? new Date(date).toLocaleDateString() : "Unknown";
    };

    // Helper to get document status
    const getDocumentStatus = (doc: Document): "pending" | "verified" | "rejected" => {
        return doc.status || "pending";
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const isPDF = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        
        if (!isPDF && !isImage) {
            toast.error("Please upload PDF or image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File must be less than 5MB");
            return;
        }

        setUploading(true);
        const toastId = toast.loading("Uploading document...");

        try {
            const formData = new FormData();
            formData.append("document", file);
            formData.append("documentType", "business_license"); // Use documentType, not type

            const result = await sellerProfile.uploadDocument(formData);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Document uploaded for verification", { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to upload document", { id: toastId });
        } finally {
            setUploading(false);
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDelete = async (documentId: string) => {
        const toastId = toast.loading("Deleting document...");
        const result = await sellerProfile.deleteDocument(documentId);
        if (result.error) {
            toast.error(result.error.message, { id: toastId });
        } else {
            toast.success("Document deleted", { id: toastId });
            router.refresh();
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-green-500">Verified</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">Pending</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "verified":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <FileText className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleUpload}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="gap-2"
                    >
                        {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        {uploading ? "Uploading..." : "Upload Business License"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: PDF, JPG, PNG, GIF (Max 5MB)
                    </p>
                </div>

                {documents.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-sm font-medium">Uploaded Documents</p>
                        {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(getDocumentStatus(doc))}
                                    <div>
                                        <p className="font-medium">{getDocumentName(doc)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Uploaded: {getUploadDate(doc)}
                                        </p>
                                    </div>
                                    {getStatusBadge(getDocumentStatus(doc))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={getDocumentUrl(doc)} target="_blank" rel="noopener noreferrer">
                                            <Eye className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(doc.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {documents.length === 0 && (
                    <div className="text-center py-6">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No documents uploaded yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Upload your business license for verification
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}