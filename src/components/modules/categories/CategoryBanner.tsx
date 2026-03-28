"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";

export function CategoryBanner() {
    const router = useRouter();

    return (
        <div className="my-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <Badge className="bg-white/20 text-white border-0 mb-3">
                        <Zap className="h-3 w-3 mr-1" />
                        Limited Time Offer
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Up to 30% Off on Vitamins
                    </h3>
                    <p className="text-white/80 text-sm max-w-md">
                        Boost your immunity with our premium vitamin collection. Limited time offer!
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push("/shop?categoryName=Vitamins")}
                    className="gap-2 group"
                >
                    Shop Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}