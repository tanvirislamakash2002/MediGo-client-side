"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface Tip {
    message: string;
    type?: "info" | "warning" | "success";
}

interface TipsRecommendationsProps {
    tips: Tip[];
}

export function TipsRecommendations({ tips }: TipsRecommendationsProps) {
    // Ensure tips is an array
    const safeTips = Array.isArray(tips) ? tips : [];
    
    if (safeTips.length === 0) {
        return (
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Lightbulb className="h-5 w-5" />
                        Tips & Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-800 dark:text-blue-200 text-center py-4">
                        ✨ No tips available at the moment.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Lightbulb className="h-5 w-5" />
                    Tips & Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {safeTips.map((tip, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span className="text-blue-800 dark:text-blue-200">{tip.message}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}