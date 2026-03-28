"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
    ArrowLeft, 
    Heart, 
    BookmarkPlus, 
    Share2 
} from "lucide-react";

interface ArticleActionsProps {
    articleId: string;
    articleTitle: string;
}

export function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleLike = () => {
        toast.success("Thanks for liking this article!");
        // TODO: API call to save like
    };

    const handleSave = () => {
        toast.success("Article saved to your reading list");
        // TODO: API call to save article
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleBack}
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            {/* Article Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleLike}>
                        <Heart className="h-4 w-4" />
                        Like
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleSave}>
                        <BookmarkPlus className="h-4 w-4" />
                        Save
                    </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>
        </div>
    );
}