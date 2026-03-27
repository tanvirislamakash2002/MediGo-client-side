"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Calendar } from "lucide-react";
import { exportActivityLogs } from "@/actions/profile.action";
import { toast } from "sonner";

interface ActivityLog {
    id: string;
    action: string;
    details: string;
    ipAddress: string;
    status: "success" | "failed";
    createdAt: string;
}

interface ActivityLogSectionProps {
    logs: ActivityLog[];
}

export function ActivityLogSection({ logs }: ActivityLogSectionProps) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
        from: "",
        to: "",
    });

    const filteredLogs = logs.filter((log) => {
        if (search && !log.action.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterStatus !== "all" && log.status !== filterStatus) return false;
        if (dateRange.from && new Date(log.createdAt) < new Date(dateRange.from)) return false;
        if (dateRange.to && new Date(log.createdAt) > new Date(dateRange.to)) return false;
        return true;
    });

    const handleExport = async () => {
        const toastId = toast.loading("Exporting logs...");
        try {
            const result = await exportActivityLogs();
            if (result.error) {
                toast.error(result.error.message, { id: toastId });
            } else {
                toast.success("Logs exported successfully", { id: toastId });
                // Trigger download
                window.location.href = result.data.url;
            }
        } catch (error) {
            toast.error("Failed to export logs", { id: toastId });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search actions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                    >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                    </select>
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            placeholder="From"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="w-32"
                        />
                        <Input
                            type="date"
                            placeholder="To"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="w-32"
                        />
                    </div>
                </div>

                {/* Logs List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No activity logs found
                        </div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{log.action}</p>
                                        <Badge
                                            variant={log.status === "success" ? "default" : "destructive"}
                                            className={log.status === "success" ? "bg-green-500" : ""}
                                        >
                                            {log.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <span>IP: {log.ipAddress}</span>
                                        <span>{formatDate(log.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}