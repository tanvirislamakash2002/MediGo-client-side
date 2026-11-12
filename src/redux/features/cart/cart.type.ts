
export interface IInitialCartState {
    items: ICartItem[];
    couponCode: string | null;
    lastValidatedAt: string | null;
    isSyncing: boolean;
    error: string | null;
}

export interface ICartItem {
    id: string;
    medicineId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
}