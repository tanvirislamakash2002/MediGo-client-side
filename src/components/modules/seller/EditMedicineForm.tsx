"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { getCategories } from "@/actions/category.action";
import { getMedicineById, updateMedicine } from "@/actions/medicine.action";
import { Category } from "@/types/category.type";

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

    // Fetch medicine data
    useEffect(() => {
        const fetchMedicine = async () => {
            setIsLoadingMedicine(true);
            try {
                const result = await getMedicineById(medicineId);
                if (result.error) {
                    setError(result.error.message);
                } else {
                    setMedicineData(result.data);
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
                if (result.error) {
                    setError(result.error.message);
                } else {
                    setCategoryData(result.data);
                }
            } catch (err) {
                setError("Failed to fetch categories");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Form submission handler
    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Updating medicine...");

        try {
            const result = await updateMedicine(medicineId, values);

            if (result.error) {
                toast.error(result.error.message, { id: toastId });
                return;
            }

            toast.success("Medicine updated successfully", { id: toastId });
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
                                name="imageUrl"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Image URL (Optional)</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder="https://example.com/image.jpg"
                                            />
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Medicine"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default EditMedicineForm