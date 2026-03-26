"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { Eye, Package, Shield, Store, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { getAllUsers, banUser, unbanUser, changeUserRole } from "@/actions/user.action";
import { toast } from "sonner";
import { UsersSkeleton } from "./UsersSkeleton";
import { BulkActionsBar } from "./BulkActionsBar";
import { UserDetailsModal } from "./UserDetailsModal";
import { ChangeRoleModal } from "./ChangeRoleModal";

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
}

interface UsersTableProps {
    initialUsers: User[];
    initialPage: number;
    initialRole?: string;
    initialStatus?: string;
    initialVerified?: string;
    initialSearch?: string;
    initialSort?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const getRoleBadge = (role: string) => {
    switch (role) {
        case "ADMIN":
            return { label: "Admin", color: "bg-red-500", icon: Shield };
        case "SELLER":
            return { label: "Seller", color: "bg-purple-500", icon: Store };
        default:
            return { label: "Customer", color: "bg-green-500", icon: null };
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
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

export function UsersTable({ 
    initialUsers, 
    initialPage,
    initialRole,
    initialStatus,
    initialVerified,
    initialSearch,
    initialSort,
    pagination: initialPagination 
}: UsersTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const currentPage = parseInt(searchParams.get("page") || initialPage.toString());

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const role = searchParams.get("role") || initialRole;
            const status = searchParams.get("status") || initialStatus;
            const verified = searchParams.get("verified") || initialVerified;
            const search = searchParams.get("search") || initialSearch;
            const sort = searchParams.get("sort") || initialSort;
            const page = parseInt(searchParams.get("page") || "1");
            
            const result = await getAllUsers({ role, status, verified, search, sort, page });
            if (!result.error) {
                setUsers(result.data?.users || []);
                setPagination(result.data?.pagination);
            }
            setIsLoading(false);
        };

        fetchUsers();
    }, [searchParams, initialRole, initialStatus, initialVerified, initialSearch, initialSort]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(users.map(user => user.id));
            setSelectedUsers(allIds);
        } else {
            setSelectedUsers(new Set());
        }
        setSelectAll(checked);
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        const newSelected = new Set(selectedUsers);
        if (checked) {
            newSelected.add(userId);
        } else {
            newSelected.delete(userId);
        }
        setSelectedUsers(newSelected);
        setSelectAll(newSelected.size === users.length);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/admin/users?${params.toString()}`);
    };

    const handleBan = async (userId: string) => {
        const result = await banUser(userId);
        if (result.error) {
            toast.error(result.error.message);
        } else {
            toast.success("User banned successfully");
            router.refresh();
        }
    };

    const handleUnban = async (userId: string) => {
        const result = await unbanUser(userId);
        if (result.error) {
            toast.error(result.error.message);
        } else {
            toast.success("User unbanned successfully");
            router.refresh();
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const result = await changeUserRole(userId, newRole);
        if (result.error) {
            toast.error(result.error.message);
        } else {
            toast.success("Role updated successfully");
            setShowRoleModal(false);
            router.refresh();
        }
    };

    if (isLoading && users.length === 0) {
        return <UsersSkeleton />;
    }

    return (
        <>
            {/* Bulk Actions Bar */}
            {selectedUsers.size > 0 && (
                <BulkActionsBar 
                    selectedCount={selectedUsers.size}
                    selectedIds={Array.from(selectedUsers)}
                    onClear={() => {
                        setSelectedUsers(new Set());
                        setSelectAll(false);
                    }}
                    onRefresh={() => router.refresh()}
                    onBan={handleBan}
                    onUnban={handleUnban}
                />
            )}
            
            {/* Users Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Verified</TableHead>
                            <TableHead className="hidden lg:table-cell">Joined</TableHead>
                            <TableHead className="hidden xl:table-cell">Orders</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">No users found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const role = getRoleBadge(user.role);
                                const RoleIcon = role.icon;
                                
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.has(user.id)}
                                                onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${role.color} text-white`}>
                                                {RoleIcon && <RoleIcon className="h-3 w-3 mr-1" />}
                                                {role.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {user.isActive ? (
                                                <Badge variant="default" className="bg-green-500 text-white">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Banned
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {user.emailVerified ? (
                                                <Badge variant="outline" className="text-green-600 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Unverified
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell text-center">
                                            {user.orderCount || 0}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowRoleModal(true);
                                                    }}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            
            {/* User Details Modal */}
            <UserDetailsModal
                isOpen={showDetailsModal}
                user={selectedUser}
                onClose={() => setShowDetailsModal(false)}
                onBan={() => selectedUser && handleBan(selectedUser.id)}
                onUnban={() => selectedUser && handleUnban(selectedUser.id)}
                onRoleChange={() => setShowRoleModal(true)}
            />
            
            {/* Change Role Modal */}
            <ChangeRoleModal
                isOpen={showRoleModal}
                user={selectedUser}
                onClose={() => setShowRoleModal(false)}
                onConfirm={handleRoleChange}
            />
        </>
    );
}