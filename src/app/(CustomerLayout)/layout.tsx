import { getSession } from "@/actions/auth.action";
import { CustomerFooter } from "@/components/layout/customer/CustomerFooter";
import { CustomerHeader } from "@/components/layout/customer/CustomerHeader";
import { CartProvider } from "@/providers/CartProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = await getSession();
        
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <CartProvider>
                <ToastProvider />
                <CustomerHeader user={session?.user || null} />
                <main className="flex-1" suppressHydrationWarning >
                    {children}
                </main>
                <CustomerFooter />
            </CartProvider>
        </div>
    );
}