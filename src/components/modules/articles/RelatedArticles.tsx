"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/data/articles";

interface RelatedArticlesProps {
    articles: Article[];
    currentArticleId: string;
    category: string;
}

export function RelatedArticles({ articles, currentArticleId, category }: RelatedArticlesProps) {
    const relatedArticles = articles
        .filter(a => a.id !== currentArticleId && a.category === category)
        .slice(0, 2);

    if (relatedArticles.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((article) => (
                    <Link 
                        key={article.id} 
                        href={`/articles/${article.id}`}
                        className="group cursor-pointer"
                    >
                        <div className="relative h-40 bg-muted rounded-lg overflow-hidden mb-3">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                            {article.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}