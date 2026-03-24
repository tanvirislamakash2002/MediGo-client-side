"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, Pill, AlertCircle, Shield, Thermometer } from "lucide-react";

interface Medicine {
    id: string;
    name: string;
    category: {
        name: string;
    };
    description: string;
    manufacturer: string;
    requiresPrescription: boolean;
}

interface MedicineInfoTabsProps {
    medicine: Medicine;
}

export function MedicineInfoTabs({ medicine }: MedicineInfoTabsProps) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="mt-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
                {/* Tab List */}
                <div className="relative">
                    <TabsList className="w-full justify-start overflow-x-auto flex-nowrap gap-1 h-auto bg-transparent p-0 border-b rounded-none scrollbar-hide">
                        <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 py-2 text-sm sm:px-4 sm:py-2 whitespace-nowrap">
                            <Info className="h-4 w-4 mr-1 sm:mr-2" />
                            Description
                        </TabsTrigger>
                        <TabsTrigger value="ingredients" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 py-2 text-sm sm:px-4 sm:py-2 whitespace-nowrap">
                            <Pill className="h-4 w-4 mr-1 sm:mr-2" />
                            Ingredients
                        </TabsTrigger>
                        <TabsTrigger value="usage" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 py-2 text-sm sm:px-4 sm:py-2 whitespace-nowrap">
                            <Info className="h-4 w-4 mr-1 sm:mr-2" />
                            Usage & Dosage
                        </TabsTrigger>
                        <TabsTrigger value="sideEffects" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 py-2 text-sm sm:px-4 sm:py-2 whitespace-nowrap">
                            <AlertTriangle className="h-4 w-4 mr-1 sm:mr-2" />
                            Side Effects
                        </TabsTrigger>
                        <TabsTrigger value="precautions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-3 py-2 text-sm sm:px-4 sm:py-2 whitespace-nowrap">
                            <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                            Precautions
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Description Tab */}
                <TabsContent value="description" className="mt-6">
                    <Card className="border shadow-sm">
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg sm:text-xl mb-3 text-foreground">
                                    About {medicine.name}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                                    {medicine.description}
                                </p>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-border">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Manufacturer
                                    </p>
                                    <p className="text-base font-medium text-foreground">
                                        {medicine.manufacturer}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Category
                                    </p>
                                    <p className="text-base font-medium text-foreground">
                                        {medicine.category?.name}
                                    </p>
                                </div>

                                {medicine.requiresPrescription && (
                                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                        <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Prescription required for this medicine
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Ingredients Tab */}
                <TabsContent value="ingredients" className="mt-6">
                    <Card className="border shadow-sm">
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-foreground">Active Ingredients</h3>
                                <p className="text-foreground">Omeprazole 20mg</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-foreground">Inactive Ingredients</h3>
                                <p className="text-foreground">Lactose monohydrate, Magnesium stearate, Titanium dioxide, Gelatin</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-3 text-foreground">Allergen Information</h3>
                                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        No known allergens detected
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Usage Tab  */}
                <TabsContent value="usage" className="mt-6">
                    <Card className="border shadow-sm">
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <h3 className="font-semibold text-lg mb-3 text-blue-800 dark:text-blue-100">
                                    Recommended Dosage
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">Adults:</span> 20mg once daily for 4-8 weeks
                                </p>
                                <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                                    <span className="font-medium">Children:</span> Not recommended for children under 18 years
                                </p>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                                    How to Take
                                </h3>
                                <p className="text-sm text-gray-800 dark:text-gray-300">
                                    Take before a meal, preferably in the morning. Swallow whole with water. Do not crush or chew.
                                </p>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                                <h3 className="font-semibold text-lg mb-2 text-amber-800 dark:text-amber-200">
                                    Missed Dose
                                </h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    Take as soon as you remember. Skip if almost time for next dose. Do not double dose.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Side Effects Tab  */}
                <TabsContent value="sideEffects" className="mt-6">
                    <Card className="border shadow-sm">
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                                <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Common Side Effects
                                </h3>
                                <ul className="space-y-2">
                                    {["Headache", "Nausea", "Diarrhea", "Stomach pain", "Gas"].map((effect, index) => (
                                        <li key={index} className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-800 dark:bg-amber-400 rounded-full"></span>
                                            {effect}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                                <h3 className="font-semibold text-lg text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Serious Side Effects
                                </h3>
                                <ul className="space-y-2">
                                    {["Severe stomach pain", "Bloody or black stools", "Vomiting that looks like coffee grounds", "Seizures"].map((effect, index) => (
                                        <li key={index} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-800 dark:bg-red-400 rounded-full mt-1.5"></span>
                                            {effect}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-100 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                    If you experience any severe side effects, stop using and consult your doctor immediately.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Precautions Tab */}
                <TabsContent value="precautions" className="mt-6">
                    <Card className="border shadow-sm">
                        <CardContent className="p-4 sm:p-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Contraindications</h3>
                                <p className="text-foreground">Do not use if allergic to omeprazole or similar medications</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Pregnancy & Breastfeeding</h3>
                                <p className="text-foreground">Consult your doctor before use during pregnancy or breastfeeding</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">Drug Interactions</h3>
                                <ul className="space-y-1">
                                    {["Clopidogrel", "Methotrexate", "Digoxin", "Certain antifungals"].map((drug, index) => (
                                        <li key={index} className="text-sm text-foreground flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                                            {drug}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2">
                                    <Thermometer className="h-5 w-5" />
                                    Storage Instructions
                                </h3>
                                <p className="text-foreground">Store at room temperature below 30°C. Keep in original packaging. Protect from moisture.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}