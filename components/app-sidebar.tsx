// components/app-sidebar.tsx
"use client";

import {
    Home,
    Users,
    UsersRound,
    UserCog,
    ShieldCheck,
    Music2,
    Calendar,
    Image,
    ChevronDown,
    ChevronRight,
    Music
} from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Cookies from "js-cookie";
import { getJson } from "@/lib/apiClient";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel, // Still imported, but not used in the removed section
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // Import toast

type UserRole = 'artist' | 'artist_manager' | 'super_admin';

export interface NavSubItem {
    title: string;
    url: string;
    icon?: React.ElementType;
    roles?: UserRole[];
}
export interface NavItem {
    title: string;
    icon: React.ElementType;
    url?: string;
    roles?: UserRole[];
    items?: NavSubItem[];
}

export const navigation: NavItem[] = [
    {
        title: "Dashboard",
        icon: Home,
        url: "/dashboard",
        roles: ['artist', 'artist_manager', 'super_admin'],
    },
    {
        title: "Artists",
        icon: Users,
        roles: ['artist_manager'],
        items: [
            { title: "All Artists", url: "/dashboard/artists" },
            { title: "New Artist", url: "/dashboard/artists/new" },
            { title: "Categories", url: "/dashboard/artists/categories" },
        ],
    },
    {
        title: "Album Management",
        icon: Music2,
        roles: ['artist_manager'],
        items: [
            { title: "Albums", url: "/dashboard/albums" },
            { title: "Manage Releases", url: "/dashboard/releases" },
        ],
    },
    {
        title: "My Music",
        icon: Music2,
        roles: ['artist'],
        items: [
            { title: "Albums", url: "/dashboard/albums" },
            { title: "Upload New", url: "/dashboard/albums/new" },
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
    // --- Super Admin Specific ---
    {
        title: "User Management",
        icon: UsersRound,
        roles: ['super_admin'],
        items: [
            {
                title: "All Users",
                url: "/dashboard/users",
                icon: Users,
                roles: ['super_admin'],
            },
            {
                title: "Artists",
                url: "/dashboard/users/artists", // Ensure this page exists
                icon: UserCog,
                roles: ['super_admin'],
            },
            {
                title: "Managers",
                url: "/dashboard/users/managers", // Ensure this page exists
                icon: ShieldCheck,
                roles: ['super_admin'],
            },
        ],
    },
];
// --- End Navigation Definition ---

// Interface for the user data from /api/users/
interface ApiUser {
    id: string | number;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    role: 'artist' | 'artist_manager'; // Add 'super_admin' if applicable from API
    first_name?: string;
    last_name?: string;
}

interface UserCounts {
    total_users: number;
    total_artists: number;
    total_managers: number;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname(); // Get current path
    const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userCounts, setUserCounts] = useState<UserCounts | null>(null);
    const [countsLoading, setCountsLoading] = useState<boolean>(false);
    const [countsError, setCountsError] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = Cookies.get("role") as UserRole | undefined;
        if (storedRole && ['artist', 'artist_manager', 'super_admin'].includes(storedRole)) {
            setUserRole(storedRole);
        } else {
            console.warn("Sidebar: User role not found or invalid in cookies.");
        }
        setIsLoading(false);
    }, []);

    // to fetch user counts for super_admin
    useEffect(() => {
        const fetchUserCounts = async () => {
            setCountsLoading(true);
            setCountsError(null);
            setUserCounts(null); // Reset counts before fetching
            try {
                // Fetch the user list and calculate counts
                console.log("Sidebar: Fetching user list for counts...");
                // !! IMPORTANT: Replace '/api/users/' with your actual endpoint to fetch all users !!
                const usersData = await getJson<ApiUser[]>('/api/users/');

                // Calculate counts from the fetched user list
                const calculatedCounts: UserCounts = {
                    total_users: 0,
                    total_artists: 0,
                    total_managers: 0,
                };
                if (usersData && usersData.length > 0) {
                    calculatedCounts.total_users = usersData.length;
                    calculatedCounts.total_artists = usersData.filter(u => u.role === 'artist').length;
                    calculatedCounts.total_managers = usersData.filter(u => u.role === 'artist_manager').length;
                }
                console.log("Sidebar: Calculated Counts:", calculatedCounts);
                setUserCounts(calculatedCounts); // Set the calculated counts

            } catch (error: any) {
                console.error("Sidebar: Failed to fetch user counts:", error);
                if (error.message !== 'Unauthorized') {
                    setCountsError("Could not load counts.");
                    toast.error("Error", { description: "Failed to load user counts for sidebar." }); // Add toast
                }
                setUserCounts(null); // Ensure counts are null on error
            } finally {
                setCountsLoading(false);
            }
        };

        if (userRole === 'super_admin') {
            fetchUserCounts();
        } else {
            // Reset states if not super_admin
            setUserCounts(null);
            setCountsError(null);
            setCountsLoading(false);
        }
    }, [userRole]); // Dependency array includes userRole

    useEffect(() => {
        if (!isLoading && userRole) {
            const activeParent = navigation.find(item =>
                item.items?.some(subItem => pathname.startsWith(subItem.url))
            );
            if (activeParent && !openSubMenus[activeParent.title]) {
                setOpenSubMenus(prev => ({ ...prev, [activeParent.title]: true }));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, userRole, pathname]); // Keep openSubMenus out to avoid loop


    const toggleSubMenu = (title: string) => {
        setOpenSubMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    // Filter navigation based on user role
    const filteredNavigation = navigation.map(item => {
        const isItemVisible = !item.roles || (userRole && item.roles.includes(userRole));
        if (!isItemVisible) {
            return null;
        }

        let visibleSubItems: NavSubItem[] = [];
        if (item.items) {
            visibleSubItems = item.items.filter(subItem =>
                !subItem.roles || (userRole && subItem.roles.includes(userRole))
            );
            // If the parent item itself has a URL and no visible subitems, show the parent
            if (visibleSubItems.length === 0 && item.url && isItemVisible) {
                return { ...item, items: undefined };
            }
            // If there are visible subitems, include them
            if (visibleSubItems.length > 0) {
                return { ...item, items: visibleSubItems };
            }
            // If no visible subitems and no parent URL, hide the parent
            if (visibleSubItems.length === 0 && !item.url) {
                return null;
            }
        }
        // If it's a top-level item with a URL and no subitems
        if (!item.items && item.url) {
            return item;
        }
        // If it had subitems but none are visible and no parent URL, hide
        if (item.items && visibleSubItems.length === 0 && !item.url) {
             return null;
        }
        // Fallback, should ideally not be reached often with above logic
        return item;
    }).filter(item => item !== null) as NavItem[];


    // --- Loading Skeleton ---
    if (isLoading) {
        return (
            <Sidebar variant="floating" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" disabled>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                                    <Skeleton className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu className="gap-1">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        );
    }
    // --- End Loading Skeleton ---

    return (
        <Sidebar variant="floating" {...props}>
            {/* --- Header --- */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"> {/* Changed bg color */}
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
            {/* --- End Header --- */}

            {/* --- Main Navigation --- */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {filteredNavigation.map((item) => {
                            const hasVisibleSubItems = item.items && item.items.length > 0;
                            const isActive = item.url === pathname ||
                                (hasVisibleSubItems && item.items.some(sub => pathname.startsWith(sub.url)));

                            return (
                                <SidebarMenuItem key={item.title}>
                                    {hasVisibleSubItems ? (
                                        <>
                                            <SidebarMenuButton
                                                isActive={isActive && !openSubMenus[item.title]}
                                                onClick={() => toggleSubMenu(item.title)}
                                                className="justify-between"
                                            >
                                                <span className="flex items-center gap-2"> {/* Wrap icon and title */}
                                                    <item.icon />
                                                    {item.title}
                                                </span>
                                                {openSubMenus[item.title] ? <ChevronDown /> : <ChevronRight />}
                                            </SidebarMenuButton>
                                            {/* Collapsible Content for Submenu */}
                                            {openSubMenus[item.title] && (
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => {
                                                        const isSubActive = pathname.startsWith(subItem.url);
                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <Link href={subItem.url} passHref legacyBehavior>
                                                                    <SidebarMenuSubButton isActive={isSubActive}>
                                                                        {subItem.title}
                                                                    </SidebarMenuSubButton>
                                                                </Link>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            )}
                                        </>
                                    ) : item.url ? (
                                        <SidebarMenuButton isActive={isActive} asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    ) : null
                                    }
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
                {/* --- End Main Navigation --- */}

                {/* --- Admin Stats Section (Conditional) --- */}
                {userRole === 'super_admin' && (
                    <>
                        <SidebarSeparator />
                        <SidebarGroup>
                            {/* <<< The SidebarGroupLabel was removed from here >>> */}
                            <SidebarMenu className="gap-0.5 pt-2"> {/* Added padding-top to compensate for label removal */}
                                {countsLoading ? (
                                    <>
                                        <Skeleton className="mx-2 h-5 w-3/4" />
                                        <Skeleton className="mx-2 h-5 w-2/3" />
                                        <Skeleton className="mx-2 h-5 w-3/5" />
                                    </>
                                ) : countsError ? (
                                    <SidebarMenuItem>
                                        <span className="px-2 text-xs text-destructive">{countsError}</span>
                                    </SidebarMenuItem>
                                ) : userCounts ? (
                                    // User counts display was previously removed
                                    <></>
                                ) : (
                                    <SidebarMenuItem>
                                        <span className="px-2 text-xs text-muted-foreground">No counts available.</span>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarGroup>
                    </>
                )}
                {/* --- End Admin Stats Section --- */}
            </SidebarContent>
        </Sidebar>
    );
}
