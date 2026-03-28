import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { 
    Clock, 
    Calendar, 
    User, 
    Eye, 
    Shield
} from "lucide-react";
import { articles } from "@/data/articles";
import { ArticleActions } from "@/components/modules/articles/ArticleActions";
import { RelatedArticles } from "@/components/modules/articles/RelatedArticles";

// Define category colors
const categoryColors: Record<string, string> = {
    "medicine-guide": "bg-blue-500",
    "seasonal": "bg-orange-500",
    "wellness": "bg-green-500",
    "nutrition": "bg-purple-500",
    "first-aid": "bg-red-500",
};

// This is a Server Component - no "use client" needed
export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = articles.find(a => a.id === id);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Article Header */}
            <div className="relative h-[400px] md:h-[500px] bg-muted">
                <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
                    <div className="container mx-auto max-w-4xl">
                        <Badge className={`${categoryColors[article.category]} text-white border-0 mb-4`}>
                            {article.categoryName}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{article.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.publishDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{article.readTime} min read</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>{article.viewCount.toLocaleString()} views</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Client Component for interactive actions */}
                    <ArticleActions articleId={article.id} articleTitle={article.title} />

                    {/* Author Info - Static */}
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg mb-8 mt-6">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold">{article.author}</p>
                            {article.authorTitle && (
                                <p className="text-sm text-muted-foreground">{article.authorTitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Article Body - Static Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                        <p className="lead">
                            {article.excerpt}
                        </p>
                        <h2>Understanding the Basics</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <h3>Key Points to Remember</h3>
                        <ul>
                            <li>Always consult with a healthcare professional before starting any new medication</li>
                            <li>Store medicines in a cool, dry place away from direct sunlight</li>
                            <li>Check expiration dates regularly and dispose of expired medications properly</li>
                            <li>Keep medicines out of reach of children</li>
                        </ul>
                        <h2>Expert Recommendations</h2>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                            deserunt mollit anim id est laborum.
                        </p>
                        <div className="bg-primary/5 p-6 rounded-lg my-8">
                            <h4 className="font-semibold mb-2">Key Takeaway</h4>
                            <p className="mb-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                            </p>
                        </div>
                    </div>

                    {/* Medical Disclaimer - Static */}
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
                        <div className="flex gap-3">
                            <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                    Medical Disclaimer
                                </p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                    This article is for informational purposes only and does not constitute medical advice. 
                                    Always consult with a qualified healthcare professional before making any health decisions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Client Component for related articles */}
                    <RelatedArticles 
                        articles={articles} 
                        currentArticleId={article.id} 
                        category={article.category} 
                    />
                </div>
            </div>
        </main>
    );
}