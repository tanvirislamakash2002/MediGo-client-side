import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Pill, Star, StarHalf } from "lucide-react";

interface Medicine {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
    category: { id: string; name: string };
    averageRating?: number;
    totalReviews?: number;
}

interface MedicineHeroProps {
    medicine: Medicine;
}

export function MedicineHero({ medicine }: MedicineHeroProps) {
    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    const renderRating = () => {
        // ✅ Return early if no rating data
        if (!medicine.averageRating && medicine.averageRating !== 0) return null;
        
        const fullStars = Math.floor(medicine.averageRating || 0);
        const hasHalfStar = (medicine.averageRating || 0) % 1 >= 0.5;
        
        return (
            <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                        if (i < fullStars) {
                            return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                        } else if (i === fullStars && hasHalfStar) {
                            return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                        } else {
                            return <Star key={i} className="h-4 w-4 text-muted-foreground" />;
                        }
                    })}
                </div>
                <span className="text-sm font-medium">{medicine.averageRating?.toFixed(1) || "0.0"}</span>
                <span className="text-sm text-muted-foreground">
                    ({medicine.totalReviews || 0} {medicine.totalReviews === 1 ? "review" : "reviews"})
                </span>
            </div>
        );
    };

    const getStockBadge = () => {
        if (medicine.stock <= 0) {
            return <Badge variant="destructive" className="text-sm">Out of Stock</Badge>;
        }
        if (medicine.stock < 10) {
            return <Badge variant="secondary" className="text-sm bg-yellow-500 text-white">Low Stock: Only {medicine.stock} left</Badge>;
        }
        return <Badge variant="default" className="text-sm bg-green-500 text-white">In Stock</Badge>;
    };

    return (
        <div className="space-y-4">
            {/* Image Container */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
                {isValidUrl(medicine.imageUrl) ? (
                    <Image
                        src={medicine.imageUrl!}
                        alt={medicine.name}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-6xl text-muted-foreground">
                        <Pill size={45}/>
                    </div>
                )}
            </div>

            <div className="block lg:hidden">
                {renderRating()}
            </div>

            {/* Thumbnails - if multiple images exist */}
            <div className="flex gap-2">
                <div className="w-16 h-16 rounded border bg-muted cursor-pointer hover:border-primary transition-colors">
                    {isValidUrl(medicine.imageUrl) ? (
                        <Image src={medicine.imageUrl!} alt="Thumbnail" width={64} height={64} className="object-cover rounded" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xl"><Pill size={45}/></div>
                    )}
                </div>
            </div>
        </div>
    );
}