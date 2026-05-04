import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Heart } from "lucide-react";

export function EmptyCart() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <Card className="max-w-md mx-auto text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">
                            Looks like you haven't added any medicines to your cart yet.
                        </p>
                        
                        <div className="space-y-3">
                            <Button asChild className="w-full">
                                <Link href="/shop">
                                    Continue Shopping
                                </Link>
                            </Button>
                            
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/shop?sortBy=createdAt&sortOrder=desc">
                                    <Heart className="h-4 w-4 mr-2" />
                                    View New Arrivals
                                </Link>
                            </Button>
                        </div>
                        
                        {/* Suggested Categories */}
                        <div className="mt-8 pt-6 border-t">
                            <p className="text-sm text-muted-foreground mb-3">
                                Popular Categories:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Link href="/shop?categoryName=Pain Relief" className="text-sm text-primary hover:underline">
                                    Pain Relief
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link href="/shop?categoryName=Vitamins" className="text-sm text-primary hover:underline">
                                    Vitamins
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link href="/shop?categoryName=Cold & Flu" className="text-sm text-primary hover:underline">
                                    Cold & Flu
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}