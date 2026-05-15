import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CategoriesSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="text-center w-24">Products</TableHead>
                        <TableHead className="hidden lg:table-cell w-32">Created</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-5 w-48" />
                            </TableCell>
                            <TableCell className="text-center">
                                <Skeleton className="h-5 w-12 mx-auto" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* Pagination Skeleton */}
            <div className="border-t px-4 py-3">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-1">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                    </div>
                </div>
            </div>
        </div>
    );
}