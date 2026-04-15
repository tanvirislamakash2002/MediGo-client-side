"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategory } from "@/actions/category.action";
import { toast } from "sonner";
import * as z from "zod";

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
});

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
        validators: {
            onSubmit: ({ value }) => {
                try {
                    formSchema.parse(value);
                    return undefined;
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const errors: Record<string, string[]> = {};
                        error.issues.forEach((issue) => {
                            const path = issue.path.join(".");
                            if (!errors[path]) errors[path] = [];
                            errors[path].push(issue.message);
                        });
                        return errors;
                    }
                    return undefined;
                }
            },
        },
        onSubmit: async ({ value }) => {
            setIsSubmitting(true);
            const toastId = toast.loading("Creating category...");
            
            try {
                const result = await createCategory(value);
                if (!result.success) {
                    toast.error(result.message, { id: toastId });
                } else {
                    toast.success("Category created successfully", { id: toastId });
                    router.refresh();
                    onClose();
                    form.reset();
                }
            } catch (error) {
                toast.error("Failed to create category", { id: toastId });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field
                        name="name"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <div>
                                    <Label htmlFor={field.name}>
                                        Category Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id={field.name}
                                        placeholder="e.g., Pain Relief"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className="mt-1"
                                        autoFocus
                                    />
                                    {isInvalid && (
                                        <p className="text-sm text-destructive mt-1">
                                            {field.state.meta.errors.join(", ")}
                                        </p>
                                    )}
                                </div>
                            );
                        }}
                    />
                    
                    <form.Field
                        name="description"
                        children={(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <div>
                                    <Label htmlFor={field.name}>Description (Optional)</Label>
                                    <Textarea
                                        id={field.name}
                                        placeholder="Brief description of this category"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        rows={3}
                                        className="mt-1"
                                    />
                                    {isInvalid && (
                                        <p className="text-sm text-destructive mt-1">
                                            {field.state.meta.errors.join(", ")}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Max 200 characters
                                    </p>
                                </div>
                            );
                        }}
                    />
                    
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Category"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}