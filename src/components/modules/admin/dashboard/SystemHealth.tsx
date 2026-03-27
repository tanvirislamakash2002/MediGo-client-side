import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SystemHealthProps {
    health: {
        api: "operational" | "degraded" | "down";
        database: "connected" | "disconnected";
        storage: { used: number; total: number };
        cache: "active" | "inactive";
        backgroundJobs: "running" | "stopped";
        lastBackup: string;
    };
}

const getStatusIcon = (status: string, type: "success" | "warning" | "error" = "success") => {
    if (status === "operational" || status === "connected" || status === "active" || status === "running") {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === "degraded" || status === "disconnected" || status === "inactive" || status === "stopped") {
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
};

export function SystemHealth({ health }: SystemHealthProps) {
    const storagePercentage = (health.storage.used / health.storage.total) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm">API Status</span>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(health.api)}
                        <span className="text-sm capitalize">{health.api}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(health.database)}
                        <span className="text-sm capitalize">{health.database}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Storage</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{Math.round(storagePercentage)}% used</span>
                        <span className="text-xs text-muted-foreground">
                            ({health.storage.used}GB / {health.storage.total}GB)
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Cache</span>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(health.cache)}
                        <span className="text-sm capitalize">{health.cache}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Background Jobs</span>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(health.backgroundJobs)}
                        <span className="text-sm capitalize">{health.backgroundJobs}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm">{health.lastBackup}</span>
                </div>
            </CardContent>
        </Card>
    );
}