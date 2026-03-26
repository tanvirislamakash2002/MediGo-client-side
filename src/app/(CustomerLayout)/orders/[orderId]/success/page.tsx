import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
    const { orderId } = await params;
    
    if (!orderId) {
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <Card className="max-w-2xl mx-auto text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
                        <p className="text-muted-foreground mb-2">
                            Thank you for your order. Your order has been confirmed.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Order ID: #{orderId.slice(0, 8).toUpperCase()}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="text-center">
                                <div className="bg-muted rounded-lg p-3 mb-2">
                                    <Package className="h-5 w-5 mx-auto text-primary" />
                                </div>
                                <p className="text-xs font-medium">Order Placed</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-muted rounded-lg p-3 mb-2">
                                    <Clock className="h-5 w-5 mx-auto text-primary" />
                                </div>
                                <p className="text-xs font-medium">Processing</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-muted rounded-lg p-3 mb-2">
                                    <Truck className="h-5 w-5 mx-auto text-primary" />
                                </div>
                                <p className="text-xs font-medium">Out for Delivery</p>
                            </div>
                        </div>
                        
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <strong>Cash on Delivery</strong><br />
                                Please keep the exact amount ready when your order arrives.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button asChild className="flex-1">
                                <Link href={`/orders/${orderId}`}>
                                    Track Order
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="flex-1">
                                <Link href="/shop">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}