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
    const medicineId = medicine.id; // ✅ Fix: use medicine.id from prop

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
        if (imagePreview && medicine.imageUrl !== imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(medicine.imageUrl || null);
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

    // Form submission handler
    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating medicine...");

        try {
            const updateResult = await updateMedicine(medicineId, values);

            if (!updateResult.success) {
                toast.error(updateResult.message, { id: toastId });
                setIsSubmitting(false);
                return;
            }

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
            toast.error("Failed to update medicine", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const form = useForm({
        defaultValues: {
            name: medicine.name, // ✅ Use medicine prop directly
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
    if (isLoadingCategories) { // ✅ Only check categories loading
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

                        {/* Rest of your form fields remain the same */}
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

                        {/* ... rest of your form fields (description, price, stock, manufacturer, category, prescription) ... */}
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
                        onClick={() => router.back()}
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