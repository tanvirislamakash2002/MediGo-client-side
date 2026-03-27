"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { sellerProfile } from "@/actions/profile";
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
    const [showPauseDialog, setShowPauseDialog] = useState(false);
    const [showCloseDialog, setShowCloseDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState("");

    const handlePauseStore = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Pausing store...");
        
        try {
            const result = await sellerProfile.pauseStore(reason);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Store paused successfully", { id: toastId });
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to pause store", { id: toastId });
        } finally {
            setIsSubmitting(false);
            setShowPauseDialog(false);
            setReason("");
        }
    };

    const handleCloseStore = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Closing store...");
        
        try {
            const result = await sellerProfile.closeStore(reason);
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Store closed successfully", { id: toastId });
                router.push("/seller");
            }
        } catch (error) {
            toast.error("Failed to close store", { id: toastId });
        } finally {
            setIsSubmitting(false);
            setShowCloseDialog(false);
            setReason("");
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmText !== "DELETE") {
            toast.error('Please type "DELETE" to confirm');
            return;
        }
        
        setIsSubmitting(true);
        const toastId = toast.loading("Deleting account...");
        
        try {
            const result = await sellerProfile.sellerDeleteAccount(reason);
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
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <p className="font-medium">Pause Store</p>
                            <p className="text-xs text-muted-foreground">
                                Temporarily hide your store from customers
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowPauseDialog(true)}>
                            Pause Store
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <p className="font-medium">Close Store</p>
                            <p className="text-xs text-muted-foreground">
                                Permanently close your store. Products will be removed.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowCloseDialog(true)}>
                            Close Store
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-destructive/50 rounded-lg bg-destructive/5">
                        <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-xs text-muted-foreground">
                                Permanently delete your seller account. This cannot be undone.
                            </p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Pause Store Dialog */}
            <AlertDialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Pause Store</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your store will be hidden from customers. You can resume anytime.
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="pause-reason">Reason (optional)</Label>
                                <Input
                                    id="pause-reason"
                                    placeholder="e.g., Vacation, Restocking"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePauseStore} disabled={isSubmitting}>
                            {isSubmitting ? "Pausing..." : "Pause Store"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Close Store Dialog */}
            <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Close Store</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently close your store. Products will be removed from the platform.
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="close-reason">Reason (optional)</Label>
                                <Input
                                    id="close-reason"
                                    placeholder="e.g., Moving to another platform"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCloseStore} disabled={isSubmitting}>
                            {isSubmitting ? "Closing..." : "Close Store"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Account Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <p>This action cannot be undone. Deleting your account will permanently remove:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Your seller profile and store</li>
                                <li>All products and listings</li>
                                <li>Order history and customer data</li>
                            </ul>
                            <div className="space-y-2">
                                <Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
                                <Input
                                    id="delete-reason"
                                    placeholder="e.g., No longer selling"
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