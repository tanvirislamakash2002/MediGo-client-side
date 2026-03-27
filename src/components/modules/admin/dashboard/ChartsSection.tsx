"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartsSectionProps {
    revenueData: Array<{ date: string; revenue: number }>;
    statusData: Array<{ name: string; value: number; color: string }>;
}

const COLORS = ["#3b82f6", "#eab308", "#8b5cf6", "#22c55e", "#ef4444"];

export function ChartsSection({ revenueData, statusData }: ChartsSectionProps) {
    return (
        <>
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    dot={{ fill: "#3b82f6" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => {
                                        if (!name || percent === undefined) return null;
                                        return `${name}: ${(percent * 100).toFixed(0)}%`;
                                    }}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}