"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "Do I need a prescription to buy medicines?",
        answer: "Some medicines require a prescription. We clearly mark prescription-required products. You can upload your prescription during checkout, and our pharmacists will verify it.",
    },
    {
        question: "How do I know which category my medicine falls under?",
        answer: "You can search by medicine name, brand, or condition. Our categories are organized by health needs and common conditions to help you find what you need easily.",
    },
    {
        question: "Are all medicines genuine?",
        answer: "Yes, 100%. All medicines are sourced from licensed manufacturers and authorized distributors. Every product is verified for authenticity.",
    },
    {
        question: "Can I return medicines if I don't need them?",
        answer: "Due to safety regulations, opened medicines cannot be returned. However, we offer a 7-day return policy for unopened, undamaged products with valid receipt.",
    },
    {
        question: "How are medicines delivered?",
        answer: "We deliver in temperature-controlled packaging to maintain medicine efficacy. Delivery takes 2-4 business days with real-time tracking.",
    },
];

export function CategoryFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold text-center mb-8">
                Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq, index) => (
                    <Card key={index} className="overflow-hidden">
                        <button
                            className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <span className="font-medium">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-5 pb-5 text-muted-foreground text-sm">
                                {faq.answer}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}