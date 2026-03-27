"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesChartProps {
    salesData: Array<{ date: string; revenue: number; orders: number }>;
    range: string;
}

export function SalesChart({ salesData, range }: SalesChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                name="Revenue ($)"
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="orders" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                name="Orders"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}