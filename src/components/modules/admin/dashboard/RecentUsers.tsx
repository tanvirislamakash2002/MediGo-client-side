"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface RecentUsersProps {
    users: User[];
}

const getRoleBadge = (role: string) => {
    switch (role) {
        case "ADMIN":
            return <Badge className="bg-red-500">Admin</Badge>;
        case "SELLER":
            return <Badge className="bg-purple-500">Seller</Badge>;
        default:
            return <Badge className="bg-green-500">Customer</Badge>;
    }
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export function RecentUsers({ users }: RecentUsersProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/users">View All →</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 font-medium">User</th>
                                <th className="text-left py-2 font-medium">Role</th>
                                <th className="text-left py-2 font-medium">Status</th>
                                <th className="text-left py-2 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0">
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2">{getRoleBadge(user.role)}</td>
                                    <td className="py-2">
                                        {user.isActive ? (
                                            <Badge variant="default" className="bg-green-500">Active</Badge>
                                        ) : (
                                            <Badge variant="destructive">Banned</Badge>
                                        )}
                                    </td>
                                    <td className="py-2 text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}