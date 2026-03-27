import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
    time: string;
    action: string;
    details?: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                            <span className="text-muted-foreground whitespace-nowrap">
                                {activity.time}
                            </span>
                            <span>
                                {activity.action}
                                {activity.details && (
                                    <span className="text-muted-foreground"> {activity.details}</span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}