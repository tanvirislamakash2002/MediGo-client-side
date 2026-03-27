"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Alert {
    type: "critical" | "warning" | "info" | "success";
    message: string;
}

interface AlertsNotificationsProps {
    alerts: Alert[];
}

const alertConfig = {
    critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200" },
    warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200" },
    success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200" },
};

export function AlertsNotifications({ alerts }: AlertsNotificationsProps) {
    if (alerts.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {alerts.map((alert, index) => {
                    const config = alertConfig[alert.type];
                    const Icon = config.icon;
                    
                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg} ${config.border}`}
                        >
                            <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
                            <p className="text-sm">{alert.message}</p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}