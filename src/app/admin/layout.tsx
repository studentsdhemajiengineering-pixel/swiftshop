
'use client';

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Home, ShoppingCart, Package, Users, Settings } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarHeader>
                        <Logo />
                    </SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/admin" isActive={pathname === '/admin'}>
                                <Home />
                                Dashboard
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/admin/products" isActive={pathname.startsWith('/admin/products')}>
                                <ShoppingCart />
                                Products
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/admin/orders" isActive={pathname.startsWith('/admin/orders')}>
                                <Package />
                                Orders
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton href="/admin/customers" isActive={pathname.startsWith('/admin/customers')}>
                                <Users />
                                Customers
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton href="/admin/settings" isActive={pathname.startsWith('/admin/settings')}>
                                <Settings />
                                Settings
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    {/* Add footer content if needed */}
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex items-center justify-between p-4 bg-background border-b h-16">
                    <SidebarTrigger />
                    {/* We can add a dynamic title here later */}
                    <div>{/* User menu or other actions */}</div>
                </header>
                <main className="p-6 bg-muted/40 flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
