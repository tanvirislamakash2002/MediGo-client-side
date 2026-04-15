"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Home, MapPin, Star } from "lucide-react";
import { customerProfile } from "@/actions/profile";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Address {
    id: string;
    recipientName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

interface AddressBookProps {
    addresses: Address[];
}

export function AddressBook({ addresses }: AddressBookProps) {
    const router = useRouter();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        recipientName: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false,
    });

    const handleAdd = async () => {
        if (!formData.recipientName || !formData.street || !formData.city || !formData.postalCode) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Adding address...");

        try {
            const result = await customerProfile.addCustomerAddress(formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Address added successfully", { id: toastId });
                setShowAddDialog(false);
                resetForm();
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to add address", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedAddress) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Updating address...");

        try {
            const result = await customerProfile.updateCustomerAddress(selectedAddress.id, formData);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Address updated successfully", { id: toastId });
                setShowEditDialog(false);
                resetForm();
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to update address", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedAddress) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Deleting address...");

        try {
            const result = await customerProfile.deleteCustomerAddress(selectedAddress.id);
            if (!result.success) {
                toast.error(result.message, { id: toastId });
            } else {
                toast.success("Address deleted successfully", { id: toastId });
                setShowDeleteDialog(false);
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete address", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetDefault = async (addressId: string) => {
        const result = await customerProfile.setDefaultAddress(addressId);
        if (!result.success) {
            toast.error(result.message);
        } else {
            toast.success("Default address updated");
            router.refresh();
        }
    };

    const resetForm = () => {
        setFormData({
            recipientName: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            phone: "",
            isDefault: false,
        });
    };

    const openEditDialog = (address: Address) => {
        setSelectedAddress(address);
        setFormData({
            recipientName: address.recipientName,
            street: address.street,
            city: address.city,
            state: address.state || "",
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone,
            isDefault: address.isDefault,
        });
        setShowEditDialog(true);
    };

    const openDeleteDialog = (address: Address) => {
        setSelectedAddress(address);
        setShowDeleteDialog(true);
    };

    const defaultAddress = addresses.find(a => a.isDefault);
    const otherAddresses = addresses.filter(a => !a.isDefault);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Address Book</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {addresses.length === 0 ? (
                        <div className="text-center py-8">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No addresses saved yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Add your first shipping address
                            </p>
                        </div>
                    ) : (
                        <>
                            {defaultAddress && (
                                <div className="border rounded-lg p-4 bg-muted/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4 text-primary" />
                                            <span className="font-medium">Default Address</span>
                                            <Badge variant="secondary">Default</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(defaultAddress)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(defaultAddress)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="font-medium">{defaultAddress.recipientName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{defaultAddress.country}</p>
                                    <p className="text-sm text-muted-foreground">{defaultAddress.phone}</p>
                                </div>
                            )}

                            {otherAddresses.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium">Other Addresses</p>
                                    {otherAddresses.map((address) => (
                                        <div key={address.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSetDefault(address.id)}
                                                        className="text-xs"
                                                    >
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Set as Default
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(address)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="font-medium">{address.recipientName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {address.street}, {address.city}, {address.state} {address.postalCode}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{address.country}</p>
                                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Add Address Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                            Enter your shipping address details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Recipient Name *</Label>
                            <Input
                                value={formData.recipientName}
                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                placeholder="Full name"
                            />
                        </div>
                        <div>
                            <Label>Street Address *</Label>
                            <Textarea
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                placeholder="Street address"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>City *</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <Label>State/Province</Label>
                                <Input
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    placeholder="State"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Postal Code *</Label>
                                <Input
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    placeholder="Postal code"
                                />
                            </div>
                            <div>
                                <Label>Country *</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="Country"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Phone number"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Address"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Address Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                        <DialogDescription>
                            Update your shipping address details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Recipient Name *</Label>
                            <Input
                                value={formData.recipientName}
                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Street Address *</Label>
                            <Textarea
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>City *</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>State/Province</Label>
                                <Input
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Postal Code *</Label>
                                <Input
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Country *</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Address Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Address</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? "Deleting..." : "Delete Address"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}