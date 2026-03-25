import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

interface Order {
    shippingAddress: string;
    phone: string;
    customer: {
        name: string;
        email: string;
    };
    deliveryInstructions?: string;
}

interface ShippingInfoProps {
    order: Order;
}

export function ShippingInfo({ order }: ShippingInfoProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b">
                <h2 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Information
                </h2>
            </div>
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p>{order.customer.name}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone Number
                    </p>
                    <p>{order.phone}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email Address
                    </p>
                    <p>{order.customer.email}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                    <p className="whitespace-pre-line">{order.shippingAddress}</p>
                </div>
                {order.deliveryInstructions && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Delivery Instructions
                        </p>
                        <p className="text-sm text-muted-foreground">{order.deliveryInstructions}</p>
                    </div>
                )}
            </div>
        </div>
    );
}