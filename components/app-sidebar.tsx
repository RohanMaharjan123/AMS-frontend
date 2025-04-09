// components/app-sidebar.tsx
"use client";
import { useState, useEffect } from "react";
import type * as React from "react";
import { Calendar, Home, Image, Music, Users, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
type UserRole = 'artist' | 'artist_manager' | 'super_admin';

interface NavItem {
    title: string;
    icon: React.ElementType;
    url?: string; 
    roles?: UserRole[]; 
    items?: NavSubItem[];
}

interface NavSubItem {
    title: string;
    url: string;
    roles?: UserRole[]; // Roles for sub-items
}

const navigation: NavItem[] = [
    {
        title: "Dashboard",
        icon: Home,
        url: "/dashboard",
        roles: ['artist', 'artist_manager', 'super_admin'], // Visible to both
    },
    {
        title: "Artists", // Manager Section
        icon: Users,
        roles: ['artist_manager'], // Only visible to managers
        items: [
            {
                title: "All Artists",
                url: "/dashboard/artists",
                // roles: ['artist_manager'] // Inherits role from parent if not specified
            },
            {
                title: "New Artist",
                url: "/dashboard/artists/new",
            },
            {
                title: "Categories",
                url: "/dashboard/artists/categories",
            },
        ],
    },
    {
        title: "My Music", // Artist Section
        icon: Music,
        roles: ['artist'], // Only visible to artists
        items: [
            {
                title: "My Albums",
                url: "/dashboard/albums", // Artist sees their albums
            },
            {
                title: "Upload New",
                url: "/dashboard/albums/new", // Artist uploads new
            },
        ],
    },
    {
        title: "Album Management", // Manager Section for Albums
        icon: Music, // Can use the same icon
        roles: ['artist_manager'], // Only visible to managers
        items: [
            {
                title: "All Albums", // Manager sees all albums
                url: "/dashboard/albums", // Could point to a different view if needed
            },
            {
                title: "Manage Releases", // Example manager-specific sub-item
                url: "/dashboard/releases", // Example different URL for managers
            },
        ],
    },
    {
        title: "Gallery",
        icon: Image,
        url: "/dashboard/gallery",
        roles: ['artist', 'artist_manager'],
    },
    {
        title: "Calendar",
        icon: Calendar,
        url: "/dashboard/calendar",
        roles: ['artist', 'artist_manager'],
    },
];


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
    const [userRole, setUserRole] = useState<UserRole | null>(null); // State for the user's role
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        const storedRole = Cookies.get("role") as UserRole | undefined;
        if (storedRole && ['artist', 'artist_manager', 'super_admin'].includes(storedRole)) { // Validate role
            setUserRole(storedRole);
        } else {
            // Handle missing or invalid role (e.g., redirect to login)
            console.warn("User role not found or invalid in cookies.");
        }
        setIsLoading(false);
    }, []);

    const toggleSubMenu = (title: string) => {
        setOpenSubMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    // Filter navigation based on userRole BEFORE rendering
    const filteredNavigation = navigation.map(item => {
        const isItemVisible = !item.roles || (userRole && item.roles.includes(userRole));
        if (!isItemVisible) {
            return null; 
        }

        let visibleSubItems: NavSubItem[] = [];
        if (item.items) {
            visibleSubItems = item.items.filter(subItem => {
                return !subItem.roles || (userRole && subItem.roles.includes(userRole));
            });
        }

        if (visibleSubItems.length > 0) {
            return { ...item, items: visibleSubItems };
        }
        if (!item.items || visibleSubItems.length === 0) {
            if (item.url) {
                return { ...item, items: undefined }; 
            } else {
                return null; 
            }
        }

        return null;

    }).filter(item => item !== null) as NavItem[]; 

    if (isLoading) {
        return (
            <Sidebar variant="floating" {...props}>
                <SidebarHeader>
                    {/* Basic Header */}
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" disabled>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted"></div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Loading...</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                </SidebarContent>
            </Sidebar>
        );
    }

    return (
        <Sidebar variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Music className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">SoundByte</span>
                                    <span className="text-xs opacity-80">Pro Suite</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {/* Map over the FILTERED navigation */}
                        {filteredNavigation.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.items && item.items.length > 0 ? (
                                    <>
                                        <SidebarMenuButton
                                            className="flex justify-between items-center"
                                            onClick={() => toggleSubMenu(item.title)}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className="mr-2 h-4 w-4" />
                                                {item.title}
                                            </div>
                                            {openSubMenus[item.title] ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </SidebarMenuButton>
                                        {openSubMenus[item.title] && (
                                            <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <Link href={subItem.url} passHref>
                                                            <SidebarMenuSubButton>{subItem.title}</SidebarMenuSubButton>
                                                        </Link>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        )}
                                    </>
                                ) : ( 
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url!} className="font-medium">
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
