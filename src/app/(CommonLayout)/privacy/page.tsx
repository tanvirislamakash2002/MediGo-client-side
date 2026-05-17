// app/(CommonLayout)/privacy/page.tsx
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    Eye,
    Database,
    Lock,
    Cookie,
    Mail,
    Phone,
    Globe,
    FileText,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Server,
    Share2,
    Trash2,
    CreditCard,
    MapPin,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy | MediGo",
    description: "Read MediGo's privacy policy to understand how we collect, use, and protect your personal information. Your privacy and data security are our top priorities.",
    keywords: "privacy policy, data protection, personal information, GDPR, privacy, security",
    openGraph: {
        title: "Privacy Policy - MediGo",
        description: "Learn how we protect your personal information and respect your privacy.",
        type: "website",
    },
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25">
                            Privacy & Security
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                        </p>
                        <p className="text-sm text-muted-foreground mt-4">
                            Last Updated: January 1, 2024
                        </p>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-8 bg-muted/30">
                <div className="container mx-auto px-4">
                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Table of Contents
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    "Information We Collect",
                                    "How We Use Your Information",
                                    "Information Sharing",
                                    "Data Security",
                                    "Your Rights",
                                    "Cookies & Tracking",
                                    "Data Retention",
                                    "Children's Privacy",
                                    "International Transfers",
                                    "Policy Updates",
                                    "Contact Us",
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        • {item}
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Introduction */}
                        <Card>
                            <CardContent className="p-6 md:p-8">
                                <p className="text-muted-foreground leading-relaxed">
                                    At MediGo, we are committed to protecting your privacy and ensuring the security of your personal information. 
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, 
                                    mobile application, and services. Please read this privacy policy carefully. By using our services, you consent to 
                                    the practices described in this policy.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Information We Collect */}
                        <div id="information-we-collect">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Database className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Information We Collect</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Personal Information You Provide</h3>
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                                                <li>Name, email address, phone number, and shipping address</li>
                                                <li>Payment information (credit/debit card details, billing address)</li>
                                                <li>Prescription information and medical history (when required)</li>
                                                <li>Account credentials and profile information</li>
                                                <li>Communication preferences and feedback</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Automatically Collected Information</h3>
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                                                <li>IP address, device type, browser information, and operating system</li>
                                                <li>Pages visited, time spent, and navigation patterns</li>
                                                <li>Location data (with your consent)</li>
                                                <li>Order history and purchase behavior</li>
                                                <li>Cookies and similar tracking technologies</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* How We Use Your Information */}
                        <div id="how-we-use-your-information">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Eye className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">How We Use Your Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "Process and fulfill your orders",
                                            "Verify prescriptions and dispense medications",
                                            "Communicate order updates and delivery status",
                                            "Provide customer support and respond to inquiries",
                                            "Improve our website and services",
                                            "Send promotional offers (with your consent)",
                                            "Prevent fraud and enhance security",
                                            "Comply with legal and regulatory requirements",
                                        ].map((use, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground">{use}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Information Sharing */}
                        <div id="information-sharing">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Share2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Information Sharing</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        We do not sell your personal information to third parties. However, we may share your information with:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                                        <li>Partner pharmacies and shipping carriers to fulfill your orders</li>
                                        <li>Payment processors to handle transactions securely</li>
                                        <li>Healthcare professionals to verify prescriptions</li>
                                        <li>Legal authorities when required by law</li>
                                        <li>Service providers who assist in our operations (under confidentiality agreements)</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Data Security */}
                        <div id="data-security">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Lock className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Data Security</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        We implement industry-standard security measures to protect your information:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            "256-bit SSL encryption for data transmission",
                                            "Regular security audits and vulnerability scans",
                                            "PCI DSS compliant payment processing",
                                            "Access controls and authentication protocols",
                                            "Secure data centers with 24/7 monitoring",
                                            "Regular employee security training",
                                        ].map((measure, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground">{measure}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Your Rights */}
                        <div id="your-rights">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Your Rights</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        Depending on your location, you may have the following rights regarding your personal information:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                                        <li>Access and receive a copy of your personal data</li>
                                        <li>Correct inaccurate or incomplete information</li>
                                        <li>Request deletion of your personal data</li>
                                        <li>Object to or restrict certain data processing</li>
                                        <li>Data portability (receive your data in a structured format)</li>
                                        <li>Withdraw consent at any time</li>
                                        <li>Lodge a complaint with a supervisory authority</li>
                                    </ul>
                                    <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            To exercise these rights, please contact us at <strong>privacy@medigo.com</strong>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Cookies & Tracking */}
                        <div id="cookies-tracking">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Cookie className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Cookies & Tracking Technologies</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        We use cookies and similar technologies to enhance your browsing experience:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                                        <li>Essential cookies for website functionality</li>
                                        <li>Analytics cookies to understand user behavior</li>
                                        <li>Preference cookies to remember your settings</li>
                                        <li>Marketing cookies for personalized advertisements (with consent)</li>
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        You can manage cookie preferences through your browser settings. However, disabling cookies may affect website functionality.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Data Retention */}
                        <div id="data-retention">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Data Retention</h2>
                                    </div>
                                    <p className="text-muted-foreground">
                                        We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                                        comply with legal obligations, resolve disputes, and enforce our agreements. 
                                        Prescription records are retained in accordance with applicable laws and regulations.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Children's Privacy */}
                        <div id="childrens-privacy">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Children's Privacy</h2>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Our services are not directed to children under 13 years of age. We do not knowingly collect personal information 
                                        from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* International Transfers */}
                        <div id="international-transfers">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Globe className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">International Data Transfers</h2>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Your information may be transferred to and processed in countries other than your own. 
                                        We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Policy Updates */}
                        <div id="policy-updates">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Updates to This Policy</h2>
                                    </div>
                                    <p className="text-muted-foreground">
                                        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                                        We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
                                        We encourage you to review this policy periodically.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Us */}
                        <div id="contact-us">
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold">Contact Us</h2>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        If you have questions about this Privacy Policy or our data practices, please contact us:
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span className="text-sm">privacy@medigo.com</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span className="text-sm">+880 1234 567890</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="text-sm">123 Healthcare Avenue, Dhaka 1212, Bangladesh</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="py-8 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        By using MediGo, you agree to the terms of this Privacy Policy. 
                        If you do not agree with any part of this policy, please do not use our services.
                    </p>
                </div>
            </section>
        </main>
    );
}