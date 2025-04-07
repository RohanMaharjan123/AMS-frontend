"use client";
import { useState } from "react";
import type * as React from "react";
import { Calendar, Home, Image, Music, Users, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

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

// Navigation data
const navigation = [
    {
        title: "Dashboard",
        icon: Home,
        url: "/dashboard",
    },
    {
        title: "Artists",
        icon: Users,
        url: "/dashboard/artists",
        items: [
            {
                title: "All Artists",
                url: "/dashboard/artists",
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
        title: "Albums",
        icon: Music,
        url: "/dashboard/albums",
        items: [
            {
                title: "Music",
                url: "/dashboard/music",
            },
            {
                title: "New Album",
                url: "/dashboard/albums/new",
            },
        ],
    },
    {
        title: "Gallery",
        icon: Image,
        url: "/dashboard/gallery",
    },
    {
        title: "Calendar",
        icon: Calendar,
        url: "/dashboard/calendar",
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // State to track the open/closed state of each sub-menu
    const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

    const toggleSubMenu = (title: string) => {
        setOpenSubMenus((prev) => ({
            ...prev,
            [title]: !prev[title], // Toggle the state of the specific sub-menu
        }));
    };

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
                        {navigation.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                {item.items ? (
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
                                        <Link href={item.url} className="font-medium">
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
