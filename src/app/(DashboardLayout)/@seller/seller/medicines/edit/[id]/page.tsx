"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

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

export default function EditMedicinePage() {
  const router = useRouter();
  const { id } = useParams();

  // Fetch medicine data
  const { data: medicine, isLoading: isLoadingMedicine } = useQuery({
    queryKey: ["medicine", id],
    queryFn: async () => {
      const response = await fetch(`/api/seller/medicines/${id}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      const result = await response.json();
      return result.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch(`/api/seller/medicines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast.success("Medicine updated successfully");
      router.push("/seller/medicines");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update medicine");
    },
  });

  const form = useForm({
    defaultValues: {
      name: medicine?.name || "",
      description: medicine?.description || "",
      price: medicine?.price || 0,
      stock: medicine?.stock || 0,
      manufacturer: medicine?.manufacturer || "",
      categoryId: medicine?.categoryId || "",
      imageUrl: medicine?.imageUrl || "",
      requiresPrescription: medicine?.requiresPrescription || false,
    },
    validators: {
      // Use a custom validation function instead of passing Zod directly
      onSubmit: ({ value }) => {
        try {
          formSchema.parse(value);
          return undefined; // No errors
        } catch (error) {
          if (error instanceof z.ZodError) {
            // Convert Zod errors to TanStack Form format
            const errors: Record<string, string[]> = {};
            // Use error.issues instead of error.errors (Zod uses .issues)
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
      updateMutation.mutate(value);
    },
  });

  if (isLoadingMedicine) {
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

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Medicine</CardTitle>
          <CardDescription>Update the details of your medicine</CardDescription>
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
                          {categories?.map((category: any) => (
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
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Medicine"}
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