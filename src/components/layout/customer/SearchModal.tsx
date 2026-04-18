"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { getMedicines } from "@/actions/medicine.action";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const recentSearches = ["Paracetamol", "Vitamin C", "Aspirin", "Omeprazole"];
const popularSearches = ["Pain Relief", "Cold & Flu", "Vitamins", "Antibiotics"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setIsLoading(true);
                const result = await getMedicines({ search: searchTerm, limit: 5 });
                setResults(!result.success ? [] : result?.data || []);
                setIsLoading(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleRecentSearch = (term: string) => {
        setSearchTerm(term);
        router.push(`/shop?search=${encodeURIComponent(term)}`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl p-0 gap-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Search Medicines</DialogTitle>
                </DialogHeader>
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for medicines, categories, or manufacturers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="border-0 shadow-none focus-visible:ring-0 p-0 text-base"
                        />
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {searchTerm.length > 2 ? (
                        <>
                            {isLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Searching...</div>
                            ) : results.length > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-muted-foreground">Suggestions</p>
                                    {results.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                router.push(`/shop/${item.id}`);
                                                onClose();
                                            }}
                                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-lg">💊</div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.manufacturer}</p>
                                            </div>
                                            <div className="text-sm font-semibold">${item.price.toFixed(2)}</div>
                                        </button>
                                    ))}
                                    <Button variant="outline" className="w-full mt-2" onClick={handleSearch}>
                                        See all results for "{searchTerm}"
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No results found for "{searchTerm}"
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* Recent Searches */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-xs font-medium text-muted-foreground">Recent Searches</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleRecentSearch(term)}
                                            className="px-3 py-1.5 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Searches */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-xs font-medium text-muted-foreground">Popular Searches</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleRecentSearch(term)}
                                            className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}