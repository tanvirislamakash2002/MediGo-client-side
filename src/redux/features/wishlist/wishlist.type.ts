export interface IWishlistItem {
    id: string;
    medicineId: string;
    addedAt: string;
    medicine?: {
        id: string;
        name: string;
        price: number;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        requiresPrescription: boolean;
        category?: { id: string; name: string };
    };
}

export interface IInitialWishlistState {
    items: IWishlistItem[];
    itemIds: string[]; // For O(1) membership checks
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
}
