import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, Search, PackageX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* 404 Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <PackageX className="h-12 w-12 text-primary" />
                    </div>
                </div>

                {/* Error Code & Message */}
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-semibold">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for. 
                        It might have been moved, deleted, or never existed.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild variant="default" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/shop">
                            <ShoppingBag className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                    
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/shop">
                            <Search className="h-4 w-4" />
                            Browse Medicines
                        </Link>
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-6 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                        You might be looking for:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Link 
                            href="/shop" 
                            className="text-sm text-primary hover:underline"
                        >
                            All Medicines
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link 
                            href="/cart" 
                            className="text-sm text-primary hover:underline"
                        >
                            My Cart
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link 
                            href="/account/orders" 
                            className="text-sm text-primary hover:underline"
                        >
                            My Orders
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link 
                            href="/contact" 
                            className="text-sm text-primary hover:underline"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}