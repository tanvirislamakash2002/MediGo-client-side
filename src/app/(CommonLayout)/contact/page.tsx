import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageSquare,
    Send,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Headphones,
    Shield,
    Truck,
    Package,
    HelpCircle,
    AlertCircle,
    CheckCircle,
    Briefcase,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us | MediGo",
    description: "Get in touch with MediGo customer support. Have questions about orders, medicines, or partnerships? Our team is here to help you.",
    keywords: "contact, customer support, help, pharmacy support, MediGo contact",
    openGraph: {
        title: "Contact MediGo - We're Here to Help",
        description: "Reach out to our customer support team for any questions or assistance.",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25">
                            Get in Touch
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            We're Here to Help You
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Have questions about your order, medicines, or need assistance? 
                            Our customer support team is available 24/7 to help you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Phone,
                                title: "Call Us",
                                details: ["+880 1234 567890", "+880 1234 567891"],
                                note: "Mon-Sun, 24/7",
                                action: "tel:+8801234567890",
                            },
                            {
                                icon: Mail,
                                title: "Email Us",
                                details: ["hello@medigo.com", "support@medigo.com"],
                                note: "Response within 24 hours",
                                action: "mailto:hello@medigo.com",
                            },
                            {
                                icon: MapPin,
                                title: "Visit Us",
                                details: ["123 Healthcare Avenue", "Dhaka 1212, Bangladesh"],
                                note: "Mon-Fri, 9AM - 6PM",
                                action: "https://maps.google.com",
                            },
                            {
                                icon: Headphones,
                                title: "24/7 Support",
                                details: ["Live Chat Available", "Emergency Support"],
                                note: "Instant response",
                                action: "#",
                            },
                        ].map((item, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                                <CardContent className="p-6">
                                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                                    <div className="space-y-1 mb-3">
                                        {item.details.map((detail, i) => (
                                            <p key={i} className="text-sm text-muted-foreground">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                    <p className="text-xs text-primary mb-3">{item.note}</p>
                                    <Link href={item.action}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            Contact Now
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card>
                            <CardContent className="p-6 md:p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                                    <p className="text-muted-foreground">
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </p>
                                </div>

                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input id="name" placeholder="Enter your full name" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" placeholder="Enter your phone number" className="mt-1" />
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input id="subject" placeholder="What is this regarding?" className="mt-1" />
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Please describe your inquiry in detail..."
                                            rows={6}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="bg-muted/30 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            <AlertCircle className="h-4 w-4 inline mr-1" />
                                            This is a static form demo. In production, this would connect to your backend.
                                        </p>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full">
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Map & Store Info */}
                        <div className="space-y-6">
                            {/* Map Placeholder */}
                            <Card className="overflow-hidden">
                                <div className="relative h-64 bg-muted">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <MapPin className="h-12 w-12 text-primary mb-2" />
                                        <p className="text-muted-foreground text-center px-4">
                                            123 Healthcare Avenue, Dhaka 1212, Bangladesh
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            📍 Google Maps Integration Available
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Store Hours */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Clock className="h-6 w-6 text-primary" />
                                        <h3 className="text-lg font-semibold">Store Hours</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { day: "Monday - Friday", hours: "9:00 AM - 9:00 PM" },
                                            { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                                            { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
                                        ].map((schedule, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b last:border-0">
                                                <span className="font-medium">{schedule.day}</span>
                                                <span className="text-muted-foreground">{schedule.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                        <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Customer Support Available 24/7
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Emergency Contact */}
                            <Card className="border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AlertCircle className="h-6 w-6 text-red-500" />
                                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                                            Emergency Contact
                                        </h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-3">
                                        For urgent medical assistance or prescription emergencies:
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">24/7 Helpline</p>
                                            <p className="text-xl font-bold text-red-600">+880 1234 567892</p>
                                        </div>
                                        <Button variant="destructive" size="sm">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <Badge className="mb-4">FAQ</Badge>
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground">
                            Find quick answers to common questions about our services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                q: "How long does delivery take?",
                                a: "Delivery typically takes 2-4 business days depending on your location. Express delivery options are available for select areas.",
                            },
                            {
                                q: "Is it safe to order medicines online?",
                                a: "Yes, we source all medicines directly from licensed manufacturers and verified suppliers. Every product undergoes strict quality checks.",
                            },
                            {
                                q: "Do I need a prescription?",
                                a: "Prescription-required medicines will need a valid prescription from a registered doctor. You can upload it during checkout.",
                            },
                            {
                                q: "What is your return policy?",
                                a: "We accept returns within 7 days for unopened products. Prescription medicines cannot be returned for safety reasons.",
                            },
                        ].map((faq, index) => (
                            <Card key={index}>
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-3">
                                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-2">{faq.q}</h3>
                                            <p className="text-sm text-muted-foreground">{faq.a}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business & Partnership Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-primary/20">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Business Partnerships</h3>
                                <p className="text-muted-foreground mb-4">
                                    Looking to partner with us? Join our network of pharmacies, hospitals, 
                                    and healthcare providers.
                                </p>
                                <Button variant="outline">
                                    Partner With Us
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Supplier Registration</h3>
                                <p className="text-muted-foreground mb-4">
                                    Are you a medicine manufacturer or distributor? Register as a supplier 
                                    to reach millions of customers.
                                </p>
                                <Button variant="outline">
                                    Become a Supplier
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Social Media Section */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
                    <p className="text-muted-foreground mb-8">
                        Follow us on social media for health tips, updates, and exclusive offers.
                    </p>
                    <div className="flex justify-center gap-4">
                        {[
                            { icon: Facebook, name: "Facebook", url: "#", color: "hover:bg-[#1877f2]" },
                            { icon: Twitter, name: "Twitter", url: "#", color: "hover:bg-[#1da1f2]" },
                            { icon: Instagram, name: "Instagram", url: "#", color: "hover:bg-[#e4405f]" },
                            { icon: Linkedin, name: "LinkedIn", url: "#", color: "hover:bg-[#0a66c2]" },
                            { icon: Youtube, name: "YouTube", url: "#", color: "hover:bg-[#ff0000]" },
                        ].map((social, index) => (
                            <Link
                                key={index}
                                href={social.url}
                                className={`p-3 bg-background rounded-full shadow-md hover:text-white transition-colors ${social.color}`}
                            >
                                <social.icon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}