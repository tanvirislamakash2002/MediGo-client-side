"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { articles } from "@/data/articles";

import { 
    Clock, 
    Calendar, 
    User, 
    Eye, 
    ArrowRight, 
    BookmarkPlus,
    Share2,
    Mail,
    Send,
    Heart,
    TrendingUp
} from "lucide-react";

interface Article {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    imageUrl: string;
    category: "medicine-guide" | "seasonal" | "wellness" | "nutrition" | "first-aid";
    categoryName: string;
    author: string;
    authorTitle?: string;
    authorAvatar?: string;
    publishDate: Date;
    readTime: number;
    viewCount: number;
    isFeatured?: boolean;
}

//     {
//         id: "1",
//         title: "How to Store Medicines Safely at Home",
//         excerpt: "Learn proper storage techniques to maintain medicine potency and keep your family safe.",
//         imageUrl: "/articles/medicine-storage.jpg",
//         category: "medicine-guide",
//         categoryName: "Medicine Guide",
//         author: "Dr. Sarah Ahmed",
//         authorTitle: "Clinical Pharmacist",
//         publishDate: new Date("2026-03-26"),
//         readTime: 4,
//         viewCount: 1245,
//         isFeatured: true,
//     },
//     {
//         id: "2",
//         title: "5 Natural Ways to Manage Spring Allergies",
//         excerpt: "Natural remedies to reduce allergy symptoms without medication side effects.",
//         imageUrl: "/articles/spring-allergy.jpg",
//         category: "seasonal",
//         categoryName: "Seasonal Health",
//         author: "Dr. Michael Chen",
//         authorTitle: "Allergy Specialist",
//         publishDate: new Date("2026-03-24"),
//         readTime: 6,
//         viewCount: 892,
//     },
//     {
//         id: "3",
//         title: "The Complete Guide to Boosting Your Immune System",
//         excerpt: "Evidence-based strategies to strengthen your immunity naturally.",
//         imageUrl: "/articles/immune-boost.jpg",
//         category: "wellness",
//         categoryName: "Wellness",
//         author: "Dr. Sarah Ahmed",
//         authorTitle: "Clinical Pharmacist",
//         publishDate: new Date("2026-03-20"),
//         readTime: 8,
//         viewCount: 2103,
//     },
//     {
//         id: "4",
//         title: "Essential Vitamins: What You Need and When",
//         excerpt: "Understanding vitamin deficiencies and choosing the right supplements.",
//         imageUrl: "/articles/vitamins.jpg",
//         category: "nutrition",
//         categoryName: "Nutrition",
//         author: "Emma Watson",
//         authorTitle: "Registered Dietitian",
//         publishDate: new Date("2026-03-18"),
//         readTime: 5,
//         viewCount: 1567,
//     },
//     {
//         id: "5",
//         title: "Building a Home First Aid Kit: Complete Checklist",
//         excerpt: "Essential items every home should have for emergency situations.",
//         imageUrl: "/articles/first-aid.jpg",
//         category: "first-aid",
//         categoryName: "First Aid",
//         author: "Dr. Michael Chen",
//         authorTitle: "Emergency Medicine",
//         publishDate: new Date("2026-03-15"),
//         readTime: 5,
//         viewCount: 734,
//     },
// ];

// Category Badge Colors
const categoryColors: Record<string, string> = {
    "medicine-guide": "bg-blue-500",
    "seasonal": "bg-orange-500",
    "wellness": "bg-green-500",
    "nutrition": "bg-purple-500",
    "first-aid": "bg-red-500",
};

// Article Card Component
function ArticleCard({ article, variant = "default" }: { article: Article; variant?: "default" | "featured" }) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [imageError, setImageError] = useState(false);

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    if (variant === "featured") {
        return (
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative h-64 md:h-full min-h-[300px] bg-muted">
                        {!imageError ? (
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-muted">
                                <span className="text-muted-foreground">No image</span>
                            </div>
                        )}
                        <Badge className="absolute top-4 left-4 bg-primary/90 text-white border-0">
                            Featured Article
                        </Badge>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <Badge className={`${categoryColors[article.category]} text-white border-0 mb-3`}>
                                {article.categoryName}
                            </Badge>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                <Link href={`/articles/${article.id}`}>{article.title}</Link>
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                            
                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(article.publishDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{article.readTime} min read</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{article.viewCount.toLocaleString()} views</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Button asChild variant="default" className="gap-2 group">
                                <Link href={`/articles/${article.id}`}>
                                    Read Article
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={() => toast.success("Share link copied!")}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            {/* Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
                {!imageError ? (
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                        <span className="text-muted-foreground">No image</span>
                    </div>
                )}
                <Badge className={`absolute top-3 left-3 ${categoryColors[article.category]} text-white border-0`}>
                    {article.categoryName}
                </Badge>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/articles/${article.id}`}>{article.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount}</span>
                    </div>
                </div>

                {/* Author & CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">{article.author.split(" ")[0]}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
                        <Link href={`/articles/${article.id}`}>
                            Read
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// Newsletter Signup Component
function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Subscribed successfully!", {
                description: "You'll receive weekly health tips in your inbox.",
            });
            setEmail("");
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-0 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">Weekly Health Tips</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Get expert health advice, medicine guides, and wellness tips delivered to your inbox every week.
                    </p>
                </div>
                <form onSubmit={handleSubscribe} className="flex gap-2 min-w-[300px]">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background"
                        required
                    />
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </Card>
    );
}

export function HealthTips() {
    const featuredArticle = articles.find(a => a.isFeatured);
    const regularArticles = articles
        .filter(a => !a.isFeatured)
        .slice(0, featuredArticle ? 3 : 4);

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Health Tips & Articles</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Wellness <span className="text-primary">Insights</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Expert advice for a healthier life. Read our latest articles on medicine, wellness, and seasonal health.
                    </p>
                </div>

                {/* Featured Article - Takes prominent position */}
                {featuredArticle && (
                    <div className="mb-12">
                        <ArticleCard article={featuredArticle} variant="featured" />
                    </div>
                )}

                {/* Articles Grid - Shows 3 regular articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {regularArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>

                {/* View All Articles Button */}
                <div className="text-center mb-12">
                    <Button asChild variant="outline" size="lg" className="gap-2">
                        <Link href="/articles">
                            View All Articles
                            <TrendingUp className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Newsletter Signup */}
                <NewsletterSignup />
            </div>
        </section>
    );
}