import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UsersSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12"><Skeleton className="h-4 w-4" /></TableHead>
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
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                            <TableCell><div className="flex gap-1"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}