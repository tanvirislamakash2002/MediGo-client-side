"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Shield, LogOut, Smartphone } from "lucide-react";
import { sellerProfile  } from "@/actions/profile";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Session {
    id: string;
    device: string;
    browser: string;
    ip: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
}

export function SecuritySection() {
    const router = useRouter();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSessionsModal, setShowSessionsModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: "",
    });

    const checkPasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        let message = "";
        if (score <= 2) message = "Weak";
        else if (score <= 4) message = "Good";
        else message = "Strong";
        
        setPasswordStrength({ score, message });
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        
        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        
        setIsSubmitting(true);
        const toastId = toast.loading("Changing password...");
        
        try {
            const result = await sellerProfile.sellerChangePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Password changed successfully", { id: toastId });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setShowPasswordModal(false);
            }
        } catch (error) {
            toast.error("Failed to change password", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const result = await sellerProfile.getSellerActiveSessions();
            if (result.success) {
                setSessions(result.data);
                setShowSessionsModal(true);
            } else {
                toast.error("Failed to load sessions");
            }
        } catch (error) {
            toast.error("Failed to load sessions");
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const handleTerminateSession = async (sessionId: string) => {
        const result = await sellerProfile.sellerTerminateSession(sessionId);
        if (!result.success) {
            toast.error("Failed to terminate session");
        } else {
            toast.success("Session terminated");
            loadSessions();
        }
    };

    const handleLogoutAll = async () => {
        const result = await sellerProfile.sellerLogoutOtherSessions();
        if (!result.success) {
            toast.error("Failed to logout other devices");
        } else {
            toast.success("Logged out from all other devices");
            loadSessions();
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Change Password</p>
                                <p className="text-xs text-muted-foreground">
                                    Update your password regularly to stay secure
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                            Change
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-600">
                            Coming Soon
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <LogOut className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Active Sessions</p>
                                <p className="text-xs text-muted-foreground">
                                    Manage devices where you're logged in
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={loadSessions}>
                            View Sessions
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Modal */}
            <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new one
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Current Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label>New Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => {
                                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                                        checkPasswordStrength(e.target.value);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${
                                                    passwordStrength.score <= 2
                                                        ? "bg-red-500 w-1/3"
                                                        : passwordStrength.score <= 4
                                                        ? "bg-yellow-500 w-2/3"
                                                        : "bg-green-500 w-full"
                                                }`}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {passwordStrength.message}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <Label>Confirm New Password</Label>
                            <div className="relative mt-1">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} disabled={isSubmitting}>
                            {isSubmitting ? "Changing..." : "Change Password"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Active Sessions Modal */}
            <Dialog open={showSessionsModal} onOpenChange={setShowSessionsModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Active Sessions</DialogTitle>
                        <DialogDescription>
                            Manage devices where you're logged in
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {isLoadingSessions ? (
                            <div className="text-center py-8">Loading sessions...</div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No active sessions found
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">
                                            {session.device} - {session.browser}
                                            {session.isCurrent && (
                                                <Badge className="ml-2 bg-green-500 text-white">Current</Badge>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            IP: {session.ip} • {session.location}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Last active: {session.lastActive}
                                        </p>
                                    </div>
                                    {!session.isCurrent && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleTerminateSession(session.id)}
                                        >
                                            Log Out
                                        </Button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleLogoutAll}>
                            Log Out All Other Devices
                        </Button>
                        <Button variant="outline" onClick={() => setShowSessionsModal(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}