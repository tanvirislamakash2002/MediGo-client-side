"use client";

import { getCategories } from "@/actions/category.action";
import { addMedicine } from "@/actions/medicine.action";
import { uploadProductImage } from "@/actions/upload.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/category.type";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Medicine name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(0.01, "Price must be greater than 0"),
    stock: z.number().int().min(0, "Stock must be 0 or greater"),
    manufacturer: z.string().min(1, "Manufacturer is required"),
    categoryId: z.string().min(1, "Category is required"),
    imageUrl: z.string(),
    requiresPrescription: z.boolean(),
});

export default function CreateMedicineForm() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [manufacturer, setManufacturer] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [requiresPrescription, setRequiresPrescription] = useState(false);
    
    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchCategory = async () => {
            setIsLoading(true);
            try {
                const result = await getCategories();
                if (!result?.success) {
                    setError(result?.message);
                } else {
                    setCategories(result.data?.categories || []);
                }
            } catch (err) {
                setError("Failed to fetch categories");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategory();
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setUploadProgress(0);
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        setUploadProgress(0);
    };

    const uploadImage = async (medicineId: string): Promise<boolean> => {
        if (!imageFile) return true;

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("file", imageFile);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const result = await uploadProductImage(medicineId, formData);
            clearInterval(progressInterval);

            if (result.success && result.data?.imageUrl) {
                setUploadProgress(100);
                return true;
            } else {
                toast.error(result.message || "Failed to upload image");
                setUploadProgress(0);
                return false;
            }
        } catch (error) {
            clearInterval(progressInterval);
            toast.error("Failed to upload image");
            setUploadProgress(0);
            return false;
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    const validateForm = (): boolean => {
        try {
            formSchema.parse({
                name,
                description,
                price,
                stock,
                manufacturer,
                categoryId,
                imageUrl: "",
                requiresPrescription,
            });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    const path = issue.path[0] as string;
                    newErrors[path] = issue.message;
                });
                setErrors(newErrors);
                toast.error("Please fix the form errors");
            }
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        const toastId = toast.loading("Adding medicine...");

        const res = await addMedicine({
            name,
            description,
            price,
            stock,
            manufacturer,
            categoryId,
            imageUrl: "",
            requiresPrescription,
        });

        if (!res?.success) {
            toast.error(res?.message, { id: toastId });
            setIsSubmitting(false);
            return;
        }

        if (imageFile && res.data?.id) {
            const uploadSuccess = await uploadImage(res.data.id);
            if (!uploadSuccess) {
                toast.warning("Medicine created but image upload failed. You can update it later.", { id: toastId });
            } else {
                toast.success('Medicine created successfully with image', { id: toastId });
            }
        } else {
            toast.success('Medicine created successfully', { id: toastId });
        }

        setIsSubmitting(false);
        router.push("/seller/medicines");
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 max-w-2xl">
                <Card>
                    <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading categories...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6 max-w-2xl">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-red-500">Error: {error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Medicine</CardTitle>
                    <CardDescription>
                        Fill in the details to add a new medicine to your inventory
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Medicine Image (Optional)</label>
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                                        <p className="text-xs text-muted-foreground">JPEG, PNG, GIF, WEBP (max 2MB)</p>
                                    </div>
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            ) : (
                                <div className="relative group">
                                    <div className="relative w-full h-48 overflow-hidden rounded-lg border bg-muted">
                                        <Image
                                            src={imagePreview}
                                            alt="Medicine preview"
                                            fill
                                            className="object-cover"
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                                                <div className="w-3/4 bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                                <p className="text-white text-sm mt-2">Uploading: {uploadProgress}%</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        disabled={isUploading}
                                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Medicine Name *</label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Paracetamol 500mg"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description *</label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the medicine, its uses, dosage, etc."
                                rows={4}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="price" className="text-sm font-medium">Price ($) *</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    id="price"
                                    value={price || ""}
                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className={errors.price ? "border-red-500" : ""}
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="stock" className="text-sm font-medium">Stock Quantity *</label>
                                <Input
                                    type="number"
                                    id="stock"
                                    value={stock || ""}
                                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className={errors.stock ? "border-red-500" : ""}
                                />
                                {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Manufacturer Field */}
                        <div className="space-y-2">
                            <label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer *</label>
                            <Input
                                id="manufacturer"
                                value={manufacturer}
                                onChange={(e) => setManufacturer(e.target.value)}
                                placeholder="e.g., ABC Pharma"
                                className={errors.manufacturer ? "border-red-500" : ""}
                            />
                            {errors.manufacturer && <p className="text-sm text-red-500">{errors.manufacturer}</p>}
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium">Category *</label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-50">
                                    {categories.map((category: Category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                        </div>

                        {/* Prescription Checkbox */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="requiresPrescription"
                                checked={requiresPrescription}
                                onCheckedChange={(checked) => setRequiresPrescription(checked as boolean)}
                            />
                            <label htmlFor="requiresPrescription" className="text-sm font-medium cursor-pointer">
                                Requires Prescription
                            </label>
                        </div>
                    </div>
                </CardContent>
                <div className="p-6 pt-0 flex gap-3">
                    <Button
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={isUploading || isSubmitting}
                    >
                        {isUploading || isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isUploading ? `Uploading... ${uploadProgress}%` : "Adding Medicine..."}
                            </>
                        ) : (
                            "Add Medicine"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.back()}
                        disabled={isUploading || isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
}