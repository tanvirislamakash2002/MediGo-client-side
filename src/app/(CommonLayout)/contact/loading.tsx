import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactLoading() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <Skeleton className="h-6 w-24 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-20 w-full mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6 text-center">
                                <Skeleton className="h-14 w-14 rounded-full mx-auto mb-4" />
                                <Skeleton className="h-6 w-24 mx-auto mb-3" />
                                <Skeleton className="h-4 w-32 mx-auto mb-1" />
                                <Skeleton className="h-4 w-28 mx-auto mb-3" />
                                <Skeleton className="h-8 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}