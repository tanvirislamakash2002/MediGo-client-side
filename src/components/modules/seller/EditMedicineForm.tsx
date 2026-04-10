"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { getCategories } from "@/actions/category.action";
import { getMedicineById, updateMedicine } from "@/actions/medicine.action";
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

const EditMedicineForm = ({ id }: { id: string }) => {
    const router = useRouter();
    const medicineId = id as string;

    // State for data
    const [medicineData, setMedicineData] = useState<MedicineData | null>(null);
    const [categoryData, setCategoryData] = useState<Category[] | null>(null);
    const [isLoadingMedicine, setIsLoadingMedicine] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    // Fetch medicine data
    useEffect(() => {
        const fetchMedicine = async () => {
            setIsLoadingMedicine(true);
            try {
                const result = await getMedicineById(medicineId);
                if (!result.success) {
                    setError(result?.message);
                } else {
                    setMedicineData(result.data);
                    // Set initial image preview from existing URL
                    if (result.data?.imageUrl) {
                        setImagePreview(result.data.imageUrl);
                    }
                }
            } catch (err) {
                setError("Failed to fetch medicine");
            } finally {
                setIsLoadingMedicine(false);
            }
        };

        fetchMedicine();
    }, [medicineId]);

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
        if (imagePreview && !medicineData?.imageUrl?.includes(imagePreview)) {
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

    // Form submission handler
    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating medicine...");

        try {
            // First update the medicine basic info
            const updateResult = await updateMedicine(medicineId, values);

            if (!updateResult.success) {
                toast.error(updateResult.message, { id: toastId });
                setIsSubmitting(false);
                return;
            }

            // If there's a new image to upload, upload it
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
            name: medicineData?.name || "",
            description: medicineData?.description || "",
            price: medicineData?.price || 0,
            stock: medicineData?.stock || 0,
            manufacturer: medicineData?.manufacturer || "",
            categoryId: medicineData?.categoryId || "",
            imageUrl: medicineData?.imageUrl || "",
            requiresPrescription: medicineData?.requiresPrescription || false,
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
    if (isLoadingMedicine || isLoadingCategories) {
        return (
            <div className="container mx-auto py-6 max-w-2xl">
                <Card>
                    <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container mx-auto py-6 max-w-2xl">
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
        <div className="container mx-auto py-6 max-w-2xl">
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
                        <FieldGroup>
                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <FieldLabel>Medicine Image</FieldLabel>
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
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
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

                            <form.Field
                                name="name"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Medicine Name</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder="e.g., Paracetamol 500mg"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />

                            <form.Field
                                name="description"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                            <Textarea
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder="Describe the medicine, its uses, dosage, etc."
                                                rows={4}
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <form.Field
                                    name="price"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Price ($)</FieldLabel>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                                    onBlur={field.handleBlur}
                                                    placeholder="0.00"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        );
                                    }}
                                />

                                <form.Field
                                    name="stock"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Stock Quantity</FieldLabel>
                                                <Input
                                                    type="number"
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                    onBlur={field.handleBlur}
                                                    placeholder="0"
                                                />
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        );
                                    }}
                                />
                            </div>

                            <form.Field
                                name="manufacturer"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Manufacturer</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder="e.g., ABC Pharma"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />

                            <form.Field
                                name="categoryId"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(value) => field.handleChange(value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoryData?.map((category: Category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />

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
                                            <FieldLabel htmlFor={field.name} className="cursor-pointer">
                                                Requires Prescription
                                            </FieldLabel>
                                        </div>
                                    );
                                }}
                            />
                        </FieldGroup>
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
}

export default EditMedicineForm;