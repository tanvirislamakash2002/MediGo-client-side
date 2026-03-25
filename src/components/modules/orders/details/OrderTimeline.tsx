import { CheckCircle, Package, Truck, Clock, XCircle } from "lucide-react";

interface Order {
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface OrderTimelineProps {
    order: Order;
}

const timelineSteps = [
    { key: "PLACED", label: "Order Placed", icon: Clock },
    { key: "PROCESSING", label: "Processing", icon: Package },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export function OrderTimeline({ order }: OrderTimelineProps) {
    const currentStatusIndex = timelineSteps.findIndex(
        (step) => step.key === order.status
    );
    
    const getStepStatus = (index: number) => {
        if (index < currentStatusIndex) return "completed";
        if (index === currentStatusIndex) return "current";
        return "pending";
    };

    if (order.status === "CANCELLED") {
        return (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-300">
                            Order Cancelled
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-400">
                            This order has been cancelled. If you have any questions, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-muted/30 rounded-lg p-6">
            <h2 className="font-semibold mb-6">Order Timeline</h2>
            <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted-foreground/20" />
                <div className="relative flex justify-between">
                    {timelineSteps.map((step, index) => {
                        const status = getStepStatus(index);
                        const Icon = step.icon;
                        const isCompleted = status === "completed";
                        const isCurrent = status === "current";
                        
                        return (
                            <div key={step.key} className="flex flex-col items-center text-center flex-1">
                                <div
                                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                                        isCompleted
                                            ? "bg-green-500 text-white"
                                            : isCurrent
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium mt-2">{step.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isCompleted && order.createdAt && formatDate(order.createdAt)}
                                    {isCurrent && "Current"}
                                    {!isCompleted && !isCurrent && "Pending"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}