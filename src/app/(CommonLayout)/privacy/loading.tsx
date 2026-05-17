import { Skeleton } from "@/components/ui/skeleton";

export default function PrivacyLoading() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-12 w-48 mx-auto mb-4" />
                    <Skeleton className="h-20 w-full mx-auto mb-8" />
                    
                    <div className="space-y-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}