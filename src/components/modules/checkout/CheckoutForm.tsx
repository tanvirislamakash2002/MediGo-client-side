"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Upload, Truck, Shield, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import Image from "next/image";
import { placeOrder } from "@/actions/order.action";

interface CartItem {
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

interface CheckoutFormProps {
    initialItems: CartItem[];
    initialTotal: number;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
    };
}

const formSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    addressLine1: z.string().min(5, "Street address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(3, "Postal code is required"),
    deliveryInstructions: z.string().optional(),
});

export function CheckoutForm({ initialItems, initialTotal, user }: CheckoutFormProps) {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([]);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    const hasPrescriptionItems = items.some(item => item.requiresPrescription);
    const subtotal = initialTotal;
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = 0;
    const total = subtotal + shippingCost + tax - discount;

    const form = useForm({
        defaultValues: {
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            postalCode: "",
            deliveryInstructions: "",
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
            const toastId = toast.loading("Placing your order...");
            
            try {
                const orderData = {
                    items: items.map(item => ({
                        cartItemId: item.id,
                        medicineId: item.medicineId,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    shippingAddress: {
                        fullName: value.fullName,
                        phone: value.phone,
                        addressLine1: value.addressLine1,
                        addressLine2: value.addressLine2 || "",
                        city: value.city,
                        postalCode: value.postalCode,
                    },
                    deliveryInstructions: value.deliveryInstructions,
                    totalAmount: total,
                    promoCode: promoCode || undefined,
                };
                
                const result = await placeOrder(orderData);
                
                if (result.error) {
                    toast.error(result.error.message, { id: toastId });
                    return;
                }
                
                toast.success("Order placed successfully!", { id: toastId });
                router.push(`/orders/${result.data.id}/success`);
                
            } catch (error) {
                toast.error("Failed to place order. Please try again.", { id: toastId });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setPrescriptionFiles(prev => [...prev, ...files]);
    };

    const removePrescriptionFile = (index: number) => {
        setPrescriptionFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        setIsApplyingPromo(true);
        setTimeout(() => {
            if (promoCode.toUpperCase() === "WELCOME10") {
                setDiscount(subtotal * 0.1);
                toast.success("Promo code applied! 10% discount");
            } else {
                toast.error("Invalid promo code");
            }
            setIsApplyingPromo(false);
        }, 500);
    };

    const isValidUrl = (url: string | null) => {
        if (!url) return false;
        try { new URL(url); return true; }
        catch { return false; }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Forms */}
            <div className="lg:w-2/3 space-y-6">
                {/* Shipping Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="checkout-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field
                                    name="fullName"
                                    children={(field) => (
                                        <div>
                                            <Label htmlFor={field.name}>Full Name</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                className="mt-1"
                                            />
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {field.state.meta.errors.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                                
                                <form.Field
                                    name="email"
                                    children={(field) => (
                                        <div>
                                            <Label htmlFor={field.name}>Email Address</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="email"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                className="mt-1"
                                            />
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {field.state.meta.errors.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            
                            <form.Field
                                name="phone"
                                children={(field) => (
                                    <div>
                                        <Label htmlFor={field.name}>Phone Number</Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="tel"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="+880 1XXX XXXXXX"
                                            className="mt-1"
                                        />
                                        {field.state.meta.isTouched && !field.state.meta.isValid && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {field.state.meta.errors.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                            
                            <form.Field
                                name="addressLine1"
                                children={(field) => (
                                    <div>
                                        <Label htmlFor={field.name}>Street Address</Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="House number, street name"
                                            className="mt-1"
                                        />
                                        {field.state.meta.isTouched && !field.state.meta.isValid && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {field.state.meta.errors.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                            
                            <form.Field
                                name="addressLine2"
                                children={(field) => (
                                    <div>
                                        <Label htmlFor={field.name}>Address Line 2 (Optional)</Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="Apartment, suite, unit"
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field
                                    name="city"
                                    children={(field) => (
                                        <div>
                                            <Label htmlFor={field.name}>City</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                className="mt-1"
                                            />
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {field.state.meta.errors.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                                
                                <form.Field
                                    name="postalCode"
                                    children={(field) => (
                                        <div>
                                            <Label htmlFor={field.name}>Postal Code</Label>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                className="mt-1"
                                            />
                                            {field.state.meta.isTouched && !field.state.meta.isValid && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {field.state.meta.errors.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            
                            <form.Field
                                name="deliveryInstructions"
                                children={(field) => (
                                    <div>
                                        <Label htmlFor={field.name}>Delivery Instructions (Optional)</Label>
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder="Gate code, landmark, special instructions"
                                            rows={3}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            />
                        </form>
                    </CardContent>
                </Card>
                
                {/* Prescription Upload */}
                {hasPrescriptionItems && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Prescription
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    This order contains prescription medicines. Please upload a valid prescription from a registered doctor.
                                </p>
                            </div>
                            
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    id="prescription"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handlePrescriptionUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="prescription"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm font-medium">Click to upload prescription</span>
                                    <span className="text-xs text-muted-foreground">
                                        Supported formats: JPG, PNG, PDF (Max 5MB)
                                    </span>
                                </label>
                            </div>
                            
                            {prescriptionFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Uploaded Files:</p>
                                    {prescriptionFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
                                            <span className="text-sm truncate">{file.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePrescriptionFile(index)}
                                                className="text-destructive"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Items List */}
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                        {isValidUrl(item.imageUrl) ? (
                                            <Image
                                                src={item.imageUrl!}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xl">💊</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        {item.requiresPrescription && (
                                            <Badge variant="outline" className="mt-1 text-xs bg-red-50 text-red-700">
                                                Rx Required
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Separator />
                        
                        {/* Promo Code */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Promo code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                onClick={handleApplyPromo}
                                disabled={isApplyingPromo || !promoCode}
                            >
                                {isApplyingPromo ? "Applying..." : "Apply"}
                            </Button>
                        </div>
                        
                        {/* Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                {shippingCost === 0 ? (
                                    <span className="text-green-600">FREE</span>
                                ) : (
                                    <span>${shippingCost.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {/* Payment Method */}
                        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-sm">Cash on Delivery</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pay with cash when your order arrives. No online payment required.
                            </p>
                        </div>
                        
                        {/* Place Order Button */}
                        <Button
                            form="checkout-form"
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Placing Order..." : "Place Order"}
                        </Button>
                        
                        {/* Trust Badges */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Shield className="h-3 w-3" />
                                <span>100% Genuine Medicines</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Truck className="h-3 w-3" />
                                <span>Free delivery on orders over $50</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Delivery in 2-4 business days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}