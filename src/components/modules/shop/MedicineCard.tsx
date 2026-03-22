import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Medicine } from "@/types"
import Link from "next/link"

export function MedicineCard({ medicineDetails }: { medicineDetails: Medicine }) {
    return (
        <Card className="relative overflow-hidden flex flex-col h-full">
            {/* Image container without absolute overlay that breaks layout */}
            <div className="relative aspect-video w-full overflow-hidden">
                <img
                    src={medicineDetails.imageUrl || "https://avatar.vercel.sh/shadcn1"}
                    alt={medicineDetails.name || "Medicine"}
                    className="w-full h-full object-cover"
                />
                {/* Optional overlay if needed */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <CardHeader className="flex-1">
                <CardAction>
                    <Badge variant="secondary">
                        {medicineDetails.categoryId || "Medicine"}
                    </Badge>
                </CardAction>
                <CardTitle className="line-clamp-1">
                    {medicineDetails.name || "Medicine Name"}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                    {medicineDetails.description || "Medicine description"}
                </CardDescription>

                {/* Add price if available */}
                {medicineDetails.price && (
                    <div className="mt-2 text-lg font-bold text-primary">
                        ${medicineDetails.price}
                    </div>
                )}
            </CardHeader>

            <CardFooter>
                <Button className="w-full">
                    <Link href={`shop/${medicineDetails?.id as string}`}>View Medicine</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}