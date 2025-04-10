// app/dashboard/layout.tsx
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Cookies from "js-cookie";
import { AppSidebar, navigation, NavItem, NavSubItem } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
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
import { LogoutButton } from "@/components/LogoutButton";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

interface BreadcrumbPart {
    href?: string;
    label: string;
}
type UserRole = 'artist' | 'artist_manager' | 'super_admin';

const getInitials = (name: string | null): string => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1 && nameParts[0].length > 0) {
        return nameParts[0].charAt(0).toUpperCase();
    }
    if (nameParts.length > 1) {
        const firstInitial = nameParts[0].charAt(0);
        const lastInitial = nameParts[nameParts.length - 1].charAt(0);
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return "U";
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbPart[]>([]);

    useEffect(() => {
        const storedRole = Cookies.get("role") as UserRole | undefined;
        const storedName = Cookies.get("name");
        if (storedRole && ['artist', 'artist_manager', 'super_admin'].includes(storedRole)) {
            setUserRole(storedRole);
        } else {
            console.warn("Layout: User role not found or invalid in cookies.");
        }
        if (storedName) setUserName(storedName);
    }, []);

    useEffect(() => {
        if (userRole === null) {
            setBreadcrumbs([{ label: 'Dashboard' }]); 
            return;
        }

        const generateBreadcrumbs = () => {
            const parts: BreadcrumbPart[] = [];
            let found = false;
            const roleFilteredNavigation = navigation.map(item => {
                const isItemVisible = !item.roles || item.roles.includes(userRole);
                if (!isItemVisible) return null;

                let visibleSubItems: NavSubItem[] = [];
                if (item.items) {
                    visibleSubItems = item.items.filter(subItem =>
                        !subItem.roles || subItem.roles.includes(userRole)
                    );
                    if (visibleSubItems.length > 0) {
                        return { ...item, items: visibleSubItems };
                    } else if (item.url) { 
                        return { ...item, items: undefined }; 
                    } else {
                        return null; 
                    }
                }
                if (!item.items && item.url) {
                    return item;
                }
                return null;
            }).filter(item => item !== null) as NavItem[];
            // --- End filtering ---

            for (const item of roleFilteredNavigation) {
                if (item.url && item.url === pathname) {
                    if (item.url !== '/dashboard') {
                        parts.push({ href: '/dashboard', label: 'Dashboard' });
                        parts.push({ label: item.title });
                    } else {
                        parts.push({ label: 'Dashboard' });
                    }
                    found = true;
                    break;
                }
                if (item.items) {
                    for (const subItem of item.items) {
                        if (subItem.url === pathname) {
                            parts.push({ href: '/dashboard', label: 'Dashboard' });
                            parts.push(item.url ? { href: item.url, label: item.title } : { label: item.title });
                            parts.push({ label: subItem.title });
                            found = true;
                            break;
                        }
                        else if (pathname.startsWith(subItem.url + '/') && subItem.url !== '/dashboard') {
                            parts.push({ href: '/dashboard', label: 'Dashboard' });
                            parts.push(item.url ? { href: item.url, label: item.title } : { label: item.title });
                            parts.push({ href: subItem.url, label: subItem.title }); 
                            const action = pathname.split('/').pop();
                            let lastLabel = 'Details';
                            if (action) {
                                if (action.toLowerCase() === 'edit') lastLabel = 'Edit';
                                else if (action.toLowerCase() === 'new') lastLabel = 'New';
                                else lastLabel = action.charAt(0).toUpperCase() + action.slice(1); 
                            }
                            parts.push({ label: lastLabel });
                            found = true;
                            break;
                        }
                    }
                }
                if (found) break;
            }

            if (!found && pathname === '/dashboard') {
                parts.push({ label: 'Dashboard' });
            } else if (parts.length === 0 && pathname.startsWith('/dashboard/')) {
                parts.push({ href: '/dashboard', label: 'Dashboard' });
                const segments = pathname.split('/').filter(Boolean);
                if (segments.length > 1) {
                    const matchedTopLevel = roleFilteredNavigation.find(nav => nav.url === `/dashboard/${segments[1]}`);
                    const matchedSubLevelParent = roleFilteredNavigation.find(nav => nav.items?.some(sub => sub.url === `/dashboard/${segments[1]}`));
                    let firstSegmentLabel = segments[1].charAt(0).toUpperCase() + segments[1].slice(1); // Default fallback

                    if (matchedTopLevel) {
                        firstSegmentLabel = matchedTopLevel.title;
                    } else if (matchedSubLevelParent) {
                        const subItem = matchedSubLevelParent.items?.find(sub => sub.url === `/dashboard/${segments[1]}`);
                        if (subItem) {
                            parts.push(matchedSubLevelParent.url ? { href: matchedSubLevelParent.url, label: matchedSubLevelParent.title } : { label: matchedSubLevelParent.title });
                            firstSegmentLabel = subItem.title;
                        } else {
                            firstSegmentLabel = matchedSubLevelParent.title;
                        }
                    }

                    parts.push({ label: firstSegmentLabel });
                    if (segments.length > 2) {
                        parts.push({ label: segments[2].charAt(0).toUpperCase() + segments[2].slice(1) });
                    }
                }
            } else if (parts.length === 0) {
                parts.push({ label: 'Page' });
            }


            setBreadcrumbs(parts);
        };

        generateBreadcrumbs();
    }, [pathname, userRole]);

    return (
        <SidebarProvider style={{ "--sidebar-width": "19rem" } as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            {index === breadcrumbs.length - 1 ? (
                                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                            ) : crumb.href ? (
                                                <BreadcrumbLink asChild>
                                                    <Link href={crumb.href}>{crumb.label}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <span className="font-medium text-foreground">{crumb.label}</span>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                ))}
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
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName || "User"} />
                                        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:inline-flex flex-col items-start">
                                        {userName && <span className="font-medium">{userName}</span>}
                                        {userRole && <span className="text-xs text-muted-foreground">{userRole.replace('_', ' ')}</span>} {/* Nicer display for role */}
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <LogoutButton />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
