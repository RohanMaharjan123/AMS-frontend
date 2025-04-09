// app/dashboard/page.tsx
"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Calendar, DollarSign, Music2, PaintBucket, Users } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";

// Sample data (keep only what's needed if fetching dynamically)
const stats = [
    {
        title: "Total Artists",
        value: "124",
        icon: Users,
        change: "+12% from last month",
        trend: "up",
    },
    {
        title: "Active Album",
        value: "38",
        icon: PaintBucket,
        change: "+5% from last month",
        trend: "up",
    },
    {
        title: "Upcoming Events",
        value: "17",
        icon: Calendar,
        change: "-3% from last month",
        trend: "down",
    },
    {
        title: "Monthly Revenue",
        value: "$48,352",
        icon: DollarSign,
        change: "+18% from last month",
        trend: "up",
    },
];

const recentArtists = [
    {
        id: 1,
        name: "Taylor Swift",
        avatar: "/media/Taylor.jpg?height=40&width=40",
        type: "Singer-songwriter, Music Producer, Actress, Director",
        status: "Active",
        Album: 11,
    },
    {
        id: 2,
        name: "Sabrina Carpenter",
        avatar: "/media/Sabrina.jpg?height=40&width=40",
        type: "Singer-songwriter, Actress, Dancer, Voice Actress",
        status: "Active",
        Album: 6,
    },
    {
        id: 3,
        name: "Gracie Abrams",
        avatar: "/media/Gracieprofile0.jpg?height=40&width=40",
        type: "Singer-songwriter, Musician",
        status: "Active",
        Album: 2,
    },
    {
        id: 4,
        name: "Olivia Rodrigo",
        avatar: "/media/Oliviaprofile.jpg?height=40&width=40",
        type: " Singer-songwriter, Actress",
        status: "Active",
        Album: 2,
    },
    {
        id: 5,
        name: "Adele",
        avatar: "/media/Adeleprofile.jpg?height=40&width=40",
        type: " Singer-songwriter, Music Producer",
        status: "Active",
        Album: 4,
    },
    // Add more artists if needed or fetch dynamically
];

// Removed upcomingEvents data as the component is removed

export default function DashboardPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
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
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                {userName && <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userName}</h1>}
                {userRole && <p className="text-muted-foreground">
                    You are logged in as a {userRole}.
                </p>}
                <p className="text-muted-foreground">
                    Here&#39;s what&#39;s happening with your artist management today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p
                                className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6">
                <Card className="col-span-full">
                    <CardHeader className="flex flex-row items-center">
                        <div>
                            <CardTitle>Recent Artists</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                You have {recentArtists.length} artists in your roster
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto gap-1">
                            <span>View All</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentArtists.map((artist) => (
                                <div key={artist.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={artist.avatar} alt={artist.name} />
                                            <AvatarFallback>
                                                {artist.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{artist.name}</p>
                                            <p className="text-xs text-muted-foreground">{artist.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span
                                                className={`text-xs font-medium ${artist.status === "Active" ? "text-green-500" : "text-amber-500"
                                                    }`}
                                            >
                                                {artist.status}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{artist.Album} Album</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Events Card - REMOVED */}

            </div>

            {/* Recent Album Card - REMOVED */}

        </div>
    );
}
