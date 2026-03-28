"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { customerProfile } from "@/actions/profile";
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
            const result = await customerProfile.customerDeleteAccount(reason);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Account deleted successfully", { id: toastId });
                router.push("/");
            }
        } catch (error) {
            toast.error("Failed to delete account", { id: toastId });
        } finally {
            setIsSubmitting(false);
            setShowDeleteDialog(false);
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
                    <div className="flex items-center justify-between p-3 border border-destructive/50 rounded-lg bg-destructive/5">
                        <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-xs text-muted-foreground">
                                Permanently delete your customer account. This cannot be undone.
                            </p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Account Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                <p>This action cannot be undone. Deleting your account will permanently remove:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Your personal information</li>
                                    <li>Order history and records</li>
                                    <li>Saved addresses</li>
                                    <li>Wishlist items</li>
                                    <li>Product reviews</li>
                                </ul>
                                <div className="space-y-2">
                                    <Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
                                    <Input
                                        id="delete-reason"
                                        placeholder="e.g., Found another store, No longer need"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-delete">
                                        Type <span className="font-mono font-bold">DELETE</span> to confirm
                                    </Label>
                                    <Input
                                        id="confirm-delete"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder="DELETE"
                                    />
                                </div>
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