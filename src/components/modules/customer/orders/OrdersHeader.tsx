interface OrdersHeaderProps {
    orderCount: number;
}

export function OrdersHeader({ orderCount }: OrdersHeaderProps) {
    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-1">
                Track and manage your orders
            </p>
            {orderCount > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                    You have {orderCount} order{orderCount !== 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
}