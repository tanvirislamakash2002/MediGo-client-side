import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Shield,
    Truck,
    Clock,
    Globe,
    Award,
    Users,
    Leaf,
    ThumbsUp,
    FileText,
    Briefcase,
    Building2,
    Stethoscope,
    Pill,
    Phone,
    Mail,
    MapPin,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us | MediGo",
    description: "Learn about MediGo - your trusted online pharmacy for genuine medicines, healthcare products, and wellness essentials. We're committed to making healthcare accessible to everyone.",
    keywords: "online pharmacy, healthcare, medicine delivery, trusted pharmacy, MediGo",
    openGraph: {
        title: "About MediGo - Your Trusted Online Pharmacy",
        description: "Making healthcare accessible to everyone through technology and trust.",
        type: "website",
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25">
                            Our Story
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Making Healthcare Accessible to Everyone
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            MediGo is on a mission to revolutionize healthcare access by providing 
                            genuine medicines, expert guidance, and seamless delivery services to 
                            millions of customers across the country.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    To provide affordable, authentic, and accessible healthcare solutions 
                                    to every doorstep, empowering people to live healthier lives through 
                                    technology and trust.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    To become the most trusted healthcare platform in the region, 
                                    bridging the gap between patients and quality medicines while 
                                    revolutionizing the pharmacy experience.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "50K+", label: "Happy Customers", icon: Users },
                            { value: "10K+", label: "Medicines Available", icon: Pill },
                            { value: "500+", label: "Partner Pharmacies", icon: Building2 },
                            { value: "24/7", label: "Customer Support", icon: Clock },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-3">
                                    <stat.icon className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-primary">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <Badge className="mb-4">Why Choose Us</Badge>
                        <h2 className="text-3xl font-bold mb-4">What Makes MediGo Different</h2>
                        <p className="text-muted-foreground">
                            We combine technology, trust, and healthcare expertise to deliver 
                            an unparalleled experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: "100% Genuine Medicines",
                                description: "All medicines are sourced directly from licensed manufacturers and verified suppliers.",
                            },
                            {
                                icon: Truck,
                                title: "Fast & Reliable Delivery",
                                description: "Free delivery on orders over $50 with real-time tracking and doorstep service.",
                            },
                            {
                                icon: Stethoscope,
                                title: "Expert Pharmacists",
                                description: "Our team of qualified pharmacists reviews every prescription for accuracy.",
                            },
                            {
                                icon: Leaf,
                                title: "Eco-Friendly Packaging",
                                description: "We use sustainable packaging materials to reduce environmental impact.",
                            },
                            {
                                icon: ThumbsUp,
                                title: "Easy Returns",
                                description: "Hassle-free returns within 7 days for unopened products.",
                            },
                            {
                                icon: Award,
                                title: "Quality Assured",
                                description: "All products undergo strict quality checks before dispatch.",
                            },
                        ].map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <Badge className="mb-4">Core Values</Badge>
                        <h2 className="text-3xl font-bold mb-4">The Values That Drive Us</h2>
                        <p className="text-muted-foreground">
                            Every decision we make is guided by our core principles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Integrity",
                                description: "We operate with complete transparency and honesty.",
                            },
                            {
                                title: "Customer First",
                                description: "Our customers' health and satisfaction are our top priority.",
                            },
                            {
                                title: "Innovation",
                                description: "We continuously improve our platform and services.",
                            },
                            {
                                title: "Excellence",
                                description: "We strive for perfection in everything we do.",
                            },
                        ].map((value, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-xl font-bold text-primary">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <Badge className="mb-4">Leadership</Badge>
                        <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
                        <p className="text-muted-foreground">
                            Passionate professionals dedicated to transforming healthcare access.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Dr. Sarah Ahmed",
                                role: "Chief Executive Officer",
                                image: "/team/sarah.jpg",
                                bio: "Former WHO consultant with 15+ years in healthcare innovation.",
                            },
                            {
                                name: "Md. Rahim Uddin",
                                role: "Chief Operating Officer",
                                image: "/team/rahim.jpg",
                                bio: "Supply chain expert with a passion for accessible healthcare.",
                            },
                            {
                                name: "Dr. Farhana Islam",
                                role: "Chief Pharmacist",
                                image: "/team/farhana.jpg",
                                bio: "Pharmacy leader ensuring quality and compliance standards.",
                            },
                        ].map((member, index) => (
                            <Card key={index} className="text-center overflow-hidden">
                                <div className="relative h-64 bg-gradient-to-b from-primary/20 to-background">
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Users className="h-16 w-16 text-primary/50" />
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-sm text-primary mb-2">{member.role}</p>
                                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications & Accreditations */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <Badge className="mb-4">Certifications</Badge>
                        <h2 className="text-3xl font-bold mb-4">Our Accreditations</h2>
                        <p className="text-muted-foreground">
                            We are recognized and certified by leading healthcare authorities.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {[
                            "ISO 9001:2021 Certified",
                            "GDP Compliant",
                            "FDA Approved",
                            "HIPAA Compliant",
                            "PCI DSS Certified",
                        ].map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                                {cert}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <Badge className="mb-4">Get in Touch</Badge>
                            <h2 className="text-3xl font-bold mb-4">We'd Love to Hear From You</h2>
                            <p className="text-muted-foreground mb-8">
                                Have questions about our services, partnerships, or anything else? 
                                Our team is ready to help.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Visit Us</p>
                                        <p className="text-sm text-muted-foreground">
                                            123 Healthcare Avenue, Dhaka 1212, Bangladesh
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Call Us</p>
                                        <p className="text-sm text-muted-foreground">
                                            +880 1234 567890
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">Email Us</p>
                                        <p className="text-sm text-muted-foreground">
                                            hello@medigo.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-4">Looking to Partner With Us?</h3>
                            <p className="text-muted-foreground mb-6">
                                Join our network of trusted pharmacies and help us expand healthcare access.
                            </p>
                            <Button size="lg" className="w-full sm:w-auto">
                                Become a Partner
                            </Button>
                            <p className="text-xs text-muted-foreground mt-4">
                                We're always looking for reliable pharmacy partners to join our network.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}