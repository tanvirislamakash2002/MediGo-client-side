import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Shield, Truck, CreditCard, Clock } from "lucide-react";

export function CustomerFooter() {
    return (
        <footer className="border-t bg-background">
            {/* Newsletter Section */}
            <div className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="font-semibold text-lg">Subscribe to our Newsletter</h3>
                            <p className="text-sm text-muted-foreground">Get updates on new medicines and exclusive offers</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 border rounded-lg bg-background"
                            />
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">MediGo</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your trusted online medicine shop. Delivering quality healthcare products to your doorstep.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+880 1234 567890</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>support@medigo.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition">FAQs</Link></li>
                            <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition">Shipping Information</Link></li>
                            <li><Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition">Return Policy</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition">Help Center</Link></li>
                            <li><Link href="/track-order" className="text-sm text-muted-foreground hover:text-primary transition">Track Order</Link></li>
                            <li><Link href="/cancel-order" className="text-sm text-muted-foreground hover:text-primary transition">Cancel Order</Link></li>
                            <li><Link href="/report" className="text-sm text-muted-foreground hover:text-primary transition">Report an Issue</Link></li>
                        </ul>
                    </div>

                    {/* Trust Badges */}
                    <div>
                        <h3 className="font-semibold mb-4">Why Shop With Us?</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-600" />
                                <span className="text-sm">100% Genuine Medicines</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Free Delivery Over $50</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Cash on Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span className="text-sm">Delivery in 2-4 Days</span>
                            </div>
                        </div>
                        
                        {/* Social Links */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                            <div className="flex gap-3">
                                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                                    <Youtube className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
                    <p>© 2026 MediGo. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms & Conditions</Link>
                        <Link href="/cookies" className="hover:text-primary">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}