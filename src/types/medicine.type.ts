export interface Medicine {
    id: string | number;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string;
    requiresPrescription: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: string | number;
    sellerId: string | number
}

export interface MedicineData  {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    categoryId: string;
    imageUrl: string;
    requiresPrescription: boolean;
};
