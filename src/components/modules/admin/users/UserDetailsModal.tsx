"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
    Mail, Phone, Calendar, Shield, Store, Package, DollarSign, 
    CheckCircle, XCircle, Activity, User,
    MapPin
} from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    orderCount?: number;
    totalSpent?: number;
    address?: string;
}

interface UserDetailsModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onBan?: () => void;
    onUnban?: () => void;
    onRoleChange?: () => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function UserDetailsModal({ isOpen, user, onClose, onBan, onUnban, onRoleChange }: UserDetailsModalProps) {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        User Details
                        <span className="text-sm font-mono text-muted-foreground">
                            #{user.id.slice(0, 8).toUpperCase()}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* User Header */}
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge className={user.role === "ADMIN" ? "bg-red-500" : user.role === "SELLER" ? "bg-purple-500" : "bg-green-500"}>
                                    {user.role}
                                </Badge>
                                {user.isActive ? (
                                    <Badge variant="default" className="bg-green-500">Active</Badge>
                                ) : (
                                    <Badge variant="destructive">Banned</Badge>
                                )}
                                {user.emailVerified ? (
                                    <Badge variant="outline" className="text-green-600">Verified</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-yellow-600">Unverified</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/30 px-4 py-3 border-b">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Contact Information
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phone || "Not provided"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {formatDate(user.createdAt)}</span>
                                </div>
                                {user.address && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <span>{user.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Account Statistics */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/30 px-4 py-3 border-b">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Account Statistics
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Orders</span>
                                    <span className="font-medium">{user.orderCount || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Spent</span>
                                    <span className="font-medium">${(user.totalSpent || 0).toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email Verified</span>
                                    {user.emailVerified ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4" /> Yes
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600 flex items-center gap-1">
                                            <XCircle className="h-4 w-4" /> No
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Account Status</span>
                                    {user.isActive ? (
                                        <span className="text-green-600">Active</span>
                                    ) : (
                                        <span className="text-red-600">Banned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b">
                            <h3 className="font-semibold">Admin Actions</h3>
                        </div>
                        <div className="p-4 flex flex-wrap gap-3">
                            {onRoleChange && (
                                <Button variant="outline" onClick={onRoleChange}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Change Role
                                </Button>
                            )}
                            
                            {user.isActive ? (
                                <Button variant="destructive" onClick={onBan}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Ban User
                                </Button>
                            ) : (
                                <Button variant="default" onClick={onUnban}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Unban User
                                </Button>
                            )}
                            
                            <Button variant="outline">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                            </Button>
                            
                            <Button variant="outline">
                                <Package className="h-4 w-4 mr-2" />
                                View Orders
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}