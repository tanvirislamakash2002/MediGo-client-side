"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { getCategories } from "@/actions/category.action";
import { updateMedicine } from "@/actions/medicine.action";
import { uploadProductImage } from "@/actions/upload.action";
import { Category } from "@/types/category.type";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

// Define the form values type
type FormValues = {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    categoryId: string;
    imageUrl: string;
    requiresPrescription: boolean;
};

interface MedicineData {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    categoryId: string;
    imageUrl: string;
    requiresPrescription: boolean;
}

interface EditMedicineFormProps {
    medicine: MedicineData;
}

// Create the Zod schema
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

const EditMedicineForm = ({ medicine }: EditMedicineFormProps) => {
    const router = useRouter();
    const medicineId = medicine.id;

    // State for data
    const [categoryData, setCategoryData] = useState<Category[] | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(medicine.imageUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isImageChanged, setIsImageChanged] = useState(false);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const result = await getCategories();
                if (!result?.success) {
                    setError(result.message);
                } else {
                    setCategoryData(result?.data?.categories);
                }
            } catch (err) {
                setError("Failed to fetch categories");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);


    // Replace handleImageSelect:
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

        // Revoke old preview URL if it was a blob
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setUploadProgress(0);
        setIsImageChanged(true);
    };

    // Replace removeImage:
    const removeImage = () => {
        // Revoke blob URL if it exists
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        // Reset to no image
        setImageFile(null);
        setImagePreview(null);
        setIsImageChanged(true);
        setUploadProgress(0);
    };

    // Update uploadImage function:
    const uploadImage = async (medicineId: string): Promise<boolean> => {
        // If no image file and no change, keep existing image
        if (!imageFile && !isImageChanged) return true;

        // If image was removed (no file and no preview), return true (no image to upload)
        if (!imageFile && !imagePreview) return true;

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
                setIsImageChanged(false);
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

    // Update handleSubmit to handle image removal:
    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating medicine...");

        try {
            // Prepare update data
            let updateData = { ...values };

            // If image was removed (no preview and no file)
            if (isImageChanged && !imagePreview && !imageFile) {
                // Set imageUrl to empty string to remove existing image
                updateData.imageUrl = "";

            }

            const updateResult = await updateMedicine(medicineId, updateData);

            if (!updateResult.success) {
                toast.error(updateResult.message, { id: toastId });
                setIsSubmitting(false);
                return;
            }

            // Upload new image if there's a file
            if (imageFile) {
                const uploadSuccess = await uploadImage(medicineId);
                if (!uploadSuccess) {
                    toast.warning("Medicine updated but image upload failed. You can try again later.", { id: toastId });
                } else {
                    toast.success("Medicine updated successfully with new image", { id: toastId });
                }
            } else {
                toast.success("Medicine updated successfully", { id: toastId });
            }

            router.push("/seller/medicines");
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update medicine", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const form = useForm({
        defaultValues: {
            name: medicine.name,
            description: medicine.description,
            price: medicine.price,
            stock: medicine.stock,
            manufacturer: medicine.manufacturer,
            categoryId: medicine.categoryId,
            imageUrl: medicine.imageUrl,
            requiresPrescription: medicine.requiresPrescription,
        },
        validators: {
            onSubmit: ({ value }) => {
                try {
                    formSchema.parse(value);
                    return undefined;
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const errors: Record<string, string[]> = {};
                        error.issues.forEach((issue: z.ZodIssue) => {
                            const path = issue.path.join(".");
                            if (!errors[path]) {
                                errors[path] = [];
                            }
                            errors[path].push(issue.message);
                        });
                        return errors;
                    }
                    return undefined;
                }
            },
        },
        onSubmit: async ({ value }) => {
            await handleSubmit(value);
        },
    });

    // Loading state
    if (isLoadingCategories) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading categories...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-red-500 mb-4">Error: {error}</p>
                        <Button onClick={() => router.back()}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleCancel = () => {
        // Clean up blob URL if exists
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        router.back();
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Medicine</CardTitle>
                    <CardDescription>
                        Update the details of your medicine
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="edit-medicine-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Medicine Image</label>
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to upload new image
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            JPEG, PNG, GIF, WEBP (max 2MB)
                                        </p>
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
                                                <p className="text-white text-sm mt-2">
                                                    Uploading: {uploadProgress}%
                                                </p>
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
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-sm font-medium">
                                            Medicine Name
                                        </label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="e.g., Paracetamol 500mg"
                                            className={isInvalid ? "border-red-500" : ""}
                                        />
                                        {isInvalid && (
                                            <p className="text-sm text-red-500">
                                                {field.state.meta.errors.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        {/* Description Field */}
                        <form.Field
                            name="description"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-sm font-medium">
                                            Description
                                        </label>
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="Describe the medicine, its uses, dosage, etc."
                                            rows={4}
                                            className={isInvalid ? "border-red-500" : ""}
                                        />
                                        {isInvalid && (
                                            <p className="text-sm text-red-500">
                                                {field.state.meta.errors.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        {/* Price and Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <form.Field
                                name="price"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <div className="space-y-2">
                                            <label htmlFor={field.name} className="text-sm font-medium">
                                                Price ($)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                                onBlur={field.handleBlur}
                                                placeholder="0.00"
                                                className={isInvalid ? "border-red-500" : ""}
                                            />
                                            {isInvalid && (
                                                <p className="text-sm text-red-500">
                                                    {field.state.meta.errors.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />

                            <form.Field
                                name="stock"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <div className="space-y-2">
                                            <label htmlFor={field.name} className="text-sm font-medium">
                                                Stock Quantity
                                            </label>
                                            <Input
                                                type="number"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                onBlur={field.handleBlur}
                                                placeholder="0"
                                                className={isInvalid ? "border-red-500" : ""}
                                            />
                                            {isInvalid && (
                                                <p className="text-sm text-red-500">
                                                    {field.state.meta.errors.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                        </div>

                        {/* Manufacturer Field */}
                        <form.Field
                            name="manufacturer"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-sm font-medium">
                                            Manufacturer
                                        </label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="e.g., ABC Pharma"
                                            className={isInvalid ? "border-red-500" : ""}
                                        />
                                        {isInvalid && (
                                            <p className="text-sm text-red-500">
                                                {field.state.meta.errors.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        {/* Category Field - Using separate state */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium">Category</label>
                            <Select
                                value={form.getFieldValue("categoryId")}
                                onValueChange={(value) => form.setFieldValue("categoryId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-50">
                                    {categoryData?.map((category: Category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Prescription Checkbox - Keep as is but add relative positioning */}
                        <div className="relative">
                            <form.Field
                                name="requiresPrescription"
                                children={(field) => {
                                    return (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={field.name}
                                                checked={field.state.value}
                                                onCheckedChange={(checked) => field.handleChange(checked as boolean)}
                                            />
                                            <label htmlFor={field.name} className="text-sm font-medium cursor-pointer">
                                                Requires Prescription
                                            </label>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </form>
                </CardContent>
                <div className="p-6 pt-0 flex gap-3">
                    <Button
                        form="edit-medicine-form"
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting || isUploading}
                    >
                        {isSubmitting || isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isUploading ? `Uploading... ${uploadProgress}%` : "Updating..."}
                            </>
                        ) : (
                            "Update Medicine"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handleCancel}
                        disabled={isSubmitting || isUploading}
                    >
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default EditMedicineForm;