"use client";
import type React from "react";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Calendar, DollarSign, Music2, PaintBucket, Users } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// Sample data for the dashboard
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
];

const upcomingEvents = [
  {
    id: 1,
    title: "Gallery Opening",
    date: "Mar 24, 2025",
    artists: 8,
  },
  {
    id: 2,
    title: "Art Workshop",
    date: "Mar 28, 2025",
    artists: 3,
  },
  {
    id: 3,
    title: "Exhibition Planning",
    date: "Apr 2, 2025",
    artists: 12,
  },
];

export default function DashboardPage() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        // Only access localStorage after the component mounts
        const storedRole = localStorage.getItem("role");
        const storedName = localStorage.getItem("name");

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
        {/* Display the user's name here */}
        {userName && <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userName}</h1>}
        {/* Display the role here */}
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
                className={`text-xs ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Artists */}
        <Card className="lg:col-span-4">
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
                        className={`text-xs font-medium ${
                          artist.status === "Active" ? "text-green-500" : "text-amber-500"
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

        {/* Upcoming Events */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{event.date}</span>
                      <Separator orientation="vertical" className="mx-2 h-3" />
                      <Users className="mr-1 h-3 w-3" />
                      <span>{event.artists} artists</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Album */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Recent Album</CardTitle>
            <p className="text-sm text-muted-foreground">
              Overview of your latest artist Album
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto gap-1">
            <span>View All</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Music2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Project {i}</h3>
                    <p className="text-xs text-muted-foreground">
                      {i === 1
                        ? "In Progress"
                        : i === 2
                        ? "Planning"
                        : "Completed"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <p className="line-clamp-2">
                    {i === 1
                      ? "Album recording with 4 artists, scheduled for completion next month."
                      : i === 2
                      ? "New exhibition planning for summer showcase featuring 8 artists."
                      : "Collaborative art installation completed with 6 artists."}
                  </p>
                </div>
                <div className="mt-3 flex justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((j) => (
                      <Avatar key={`${i}-${j}`} className="border-2 border-background h-6 w-6">
                        <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                        <AvatarFallback>A{j}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
