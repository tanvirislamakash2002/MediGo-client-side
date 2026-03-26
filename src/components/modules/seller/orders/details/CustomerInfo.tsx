"use client";

import { MapPin, Phone, Mail, User } from "lucide-react";

interface Order {
    customer?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    phone?: string;
    shippingAddress?: string;
    deliveryInstructions?: string;
}

interface CustomerInfoProps {
    order: Order;
}

export function CustomerInfo({ order }: CustomerInfoProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
                <h2 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                </h2>
            </div>
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p>{order.customer?.name || "Not available"}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone Number
                    </p>
                    <p>{order.customer?.phone || order.phone || "Not available"}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email Address
                    </p>
                    <p>{order.customer?.email || "Not available"}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Shipping Address
                    </p>
                    <p className="whitespace-pre-line">{order.shippingAddress || "Not available"}</p>
                </div>
                {order.deliveryInstructions && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Delivery Instructions</p>
                        <p className="text-sm text-muted-foreground">{order.deliveryInstructions}</p>
                    </div>
                )}
            </div>
        </div>
    );
}