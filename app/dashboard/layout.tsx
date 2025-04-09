// app/dashboard/layout.tsx
"use client";

import type * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import Cookies from "js-cookie";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Helper function to get initials
const getInitials = (name: string | null): string => {
    if (!name) return "U"; // Default fallback if name is not available

    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1 && nameParts[0].length > 0) {
        // Handle single names (e.g., "Admin")
        return nameParts[0].charAt(0).toUpperCase();
    }
    if (nameParts.length > 1) {
        // Get first letter of the first name and first letter of the last name
        const firstInitial = nameParts[0].charAt(0);
        const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return "U"; // Fallback for empty string or unexpected cases
};


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        // Only access cookies after the component mounts
        const storedRole = Cookies.get("role");
        const storedName = Cookies.get("name");

        if (storedRole) {
            setUserRole(storedRole);
        }

        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "19rem",
            } as React.CSSProperties}
        >
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        {/* Update alt attribute */}
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName || "User"} />
                                        {/* Use the helper function */}
                                        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:inline-flex flex-col items-start">
                                        {/* Display the user's name here */}
                                        {userName && <span className="font-medium">{userName}</span>}
                                        {/* Display the role here */}
                                        {userRole && <span className="text-xs text-muted-foreground">{userRole}</span>}
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/dashboard/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <LogoutButton />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
