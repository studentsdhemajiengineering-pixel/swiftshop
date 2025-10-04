
'use client';

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Home, ShoppingCart, Package, Users, Settings, User as UserIcon, LogOut, Tags } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { usePathname, useRouter } from "next/navigation";
import { useFirebase } from '@/firebase';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/components/auth/private-route";

function AdminHeader() {
    const { user, logout } = useFirebase();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/admin/login');
    };
    
    return (
        <header className="flex items-center justify-between p-4 bg-background border-b h-16">
            <SidebarTrigger />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user?.displayName || 'Admin'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { href: "/admin", label: "Dashboard", icon: Home },
        { href: "/admin/products", label: "Products", icon: ShoppingCart },
        { href: "/admin/categories", label: "Categories", icon: Tags },
        { href: "/admin/orders", label: "Orders", icon: Package },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarHeader>
                        <Logo />
                    </SidebarHeader>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton 
                                    onClick={() => router.push(item.href)} 
                                    isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                                >
                                    <item.icon />
                                    {item.label}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <AdminHeader />
                <main className="p-6 bg-muted/40 flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <PrivateRoute adminOnly={true}>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </PrivateRoute>
    );
}
