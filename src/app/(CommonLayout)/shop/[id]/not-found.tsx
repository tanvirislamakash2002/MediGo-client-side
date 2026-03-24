import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MedicineNotFound() {
    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Medicine Not Found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        The medicine you're looking for doesn't exist or has been removed.
                    </p>
                    <Button asChild>
                        <Link href="/shop">Browse All Medicines</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}