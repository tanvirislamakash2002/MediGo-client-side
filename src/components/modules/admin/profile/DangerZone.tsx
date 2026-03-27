"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Download } from "lucide-react";
import { adminProfile } from "@/actions/profile";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DangerZone() {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState("");

    const handleDeleteAccount = async () => {
        if (confirmText !== "DELETE") {
            toast.error('Please type "DELETE" to confirm');
            return;
        }
        
        setIsSubmitting(true);
        const toastId = toast.loading("Deleting account...");
        
        try {
            const result = await adminProfile.adminDeleteAccount(reason);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Account deleted successfully", { id: toastId });
                router.push("/logout");
            }
        } catch (error) {
            toast.error("Failed to delete account", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportData = async () => {
        const toastId = toast.loading("Exporting data...");
        try {
            const result = await adminProfile.adminExportAccountData();
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Data exported successfully", { id: toastId });
                window.location.href = result.data.url;
            }
        } catch (error) {
            toast.error("Failed to export data", { id: toastId });
        }
    };

    return (
        <>
            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Export Data */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <p className="font-medium">Export Account Data</p>
                            <p className="text-xs text-muted-foreground">
                                Download all your account data (GDPR compliant)
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExportData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-3 border border-destructive/50 rounded-lg bg-destructive/5">
                        <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-xs text-muted-foreground">
                                Permanently delete your account and all associated data
                            </p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Account Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">Delete Account</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <p>
                                This action cannot be undone. Deleting your account will permanently remove:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Your profile information</li>
                                <li>Your admin access to the platform</li>
                                <li>Your activity logs</li>
                            </ul>
                            <p className="font-medium text-destructive">
                                This will not affect existing orders or products.
                            </p>
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="reason">Reason for deletion (optional)</Label>
                                <Input
                                    id="reason"
                                    placeholder="e.g., No longer needed, Moving to another platform"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">
                                    Type <span className="font-mono font-bold">DELETE</span> to confirm
                                </Label>
                                <Input
                                    id="confirm"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isSubmitting || confirmText !== "DELETE"}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSubmitting ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}