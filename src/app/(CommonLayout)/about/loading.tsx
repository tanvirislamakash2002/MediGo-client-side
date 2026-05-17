import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <Skeleton className="h-6 w-24 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
                    <Skeleton className="h-20 w-full mx-auto" />
                </div>
            </div>
        </main>
    );
}