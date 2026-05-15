import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageSearch, Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function MedicineNotFound() {
    return (
        <div className="container mx-auto py-16">
            <Card className="max-w-md mx-auto text-center">
                <CardContent className="pt-12 pb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                            <PackageSearch className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Medicine Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        The medicine you're trying to edit doesn't exist or you don't have permission to edit it.
                    </p>
                    
                    <div className="space-y-3">
                        <Button asChild className="w-full">
                            <Link href="/seller/medicines">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Medicines
                            </Link>
                        </Button>
                        
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/seller/medicines/add">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add New Medicine
                            </Link>
                        </Button>
                        
                        <Button asChild variant="ghost" className="w-full">
                            <Link href="/seller/dashboard">
                                <Home className="h-4 w-4 mr-2" />
                                Go to Dashboard
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}