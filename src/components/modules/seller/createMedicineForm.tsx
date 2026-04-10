"use client";

import { getCategories } from "@/actions/category.action";
import { addMedicine } from "@/actions/medicine.action";
import { uploadProductImage } from "@/actions/upload.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/category.type";
import { useForm } from "@tanstack/react-form";
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

            // Change from result.data?.url to result.data?.imageUrl
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

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            manufacturer: "",
            categoryId: "",
            imageUrl: "",
            requiresPrescription: false,
        },
        validators: {
            onSubmit: formSchema
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Adding medicine...");

            // First create the medicine without image
            const res = await addMedicine({
                ...value,
                imageUrl: "", // Empty initially
            });

            if (!res?.success) {
                toast.error(res?.message, { id: toastId });
                return;
            }

            // If image exists, upload it using the created medicine ID
            if (imageFile && res.data?.id) {
                const uploadSuccess = await uploadImage(res.data.id);
                console.log('uploadSuccess------------', uploadSuccess);
                if (!uploadSuccess) {
                    toast.warning("Medicine created but image upload failed. You can update it later.", { id: toastId });
                } else {
                    toast.success('Medicine created successfully with image', { id: toastId });
                }
            } else {
                toast.success('Medicine created successfully', { id: toastId });
            }

            router.push("/seller/medicines");
        },
    });

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
                    <form
                        id="add-medicine-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <FieldGroup>
                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <FieldLabel>Medicine Image (Optional)</FieldLabel>
                                {!imagePreview ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Click to upload image
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
                                                    {categories.map((category: Category) => (
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
                        form="add-medicine-form"
                        type="submit"
                        className="flex-1"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading... {uploadProgress}%
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
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
}