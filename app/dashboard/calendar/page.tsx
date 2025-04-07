"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { CustomCalendar } from "@/components/custom-calendar";

// Sample Data (Replace with API Fetching)
interface Event {
    id: number;
    title: string;
    date: Date;
    artistId: number;
    artistName: string;
    type: "Concert" | "Booking" | "Release";
}

const sampleEvents: Event[] = [
    {
        id: 1,
        title: "Concert in New York",
        date: new Date("2024-08-15"),
        artistId: 1,
        artistName: "Taylor Swift",
        type: "Concert",
    },
    {
        id: 2,
        title: "Studio Booking",
        date: new Date("2024-08-20"),
        artistId: 2,
        artistName: "Sabrina Carpenter",
        type: "Booking",
    },
    {
        id: 3,
        title: "Album Release",
        date: new Date("2024-08-25"),
        artistId: 3,
        artistName: "Gracie Abrams",
        type: "Release",
    },
    {
        id: 4,
        title: "Concert in Los Angeles",
        date: new Date("2024-09-05"),
        artistId: 4,
        artistName: "Olivia Rodrigo",
        type: "Concert",
    },
    {
        id: 5,
        title: "Studio Booking",
        date: new Date("2024-09-10"),
        artistId: 5,
        artistName: "Adele",
        type: "Booking",
    },
    {
        id: 6,
        title: "Album Release",
        date: new Date("2024-09-15"),
        artistId: 6,
        artistName: "Drake",
        type: "Release",
    },
    {
        id: 7,
        title: "Concert in Chicago",
        date: new Date("2024-09-20"),
        artistId: 7,
        artistName: "Kendrick Lamar",
        type: "Concert",
    },
    {
        id: 8,
        title: "Studio Booking",
        date: new Date("2024-09-25"),
        artistId: 8,
        artistName: "Billie Eilish",
        type: "Booking",
    },
    {
        id: 9,
        title: "Album Release",
        date: new Date("2024-10-05"),
        artistId: 9,
        artistName: "Ed Sheeran",
        type: "Release",
    },
    {
        id: 10,
        title: "Concert in Houston",
        date: new Date("2024-10-10"),
        artistId: 10,
        artistName: "Post Malone",
        type: "Concert",
    },
];

// Sample Artists (Replace with API Fetching)
const sampleArtists = [
    { id: 1, name: "Taylor Swift" },
    { id: 2, name: "Sabrina Carpenter" },
    { id: 3, name: "Gracie Abrams" },
    { id: 4, name: "Olivia Rodrigo" },
    { id: 5, name: "Adele" },
    { id: 6, name: "Drake" },
    { id: 7, name: "Kendrick Lamar" },
    { id: 8, name: "Billie Eilish" },
    { id: 9, name: "Ed Sheeran" },
    { id: 10, name: "Post Malone" },
];

// Sample Event Types (Replace with API Fetching)
const eventTypes = ["All", "Concert", "Booking", "Release"];

const CalendarPage = () => {
    const [events, setEvents] = useState<Event[]>(sampleEvents);
    const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
    const [selectedEventType, setSelectedEventType] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        // Filter events based on selected artist, event type, and search query
        const filteredEvents = sampleEvents.filter((item) => {
            const artistMatch =
                selectedArtist === null || item.artistId === selectedArtist;
            const eventTypeMatch =
                selectedEventType === "All" || item.type === selectedEventType;
            const searchMatch = item.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            return artistMatch && eventTypeMatch && searchMatch;
        });
        setEvents(filteredEvents);
    }, [selectedArtist, selectedEventType, searchQuery]);

    const handleArtistChange = (artistId: string) => {
        setSelectedArtist(artistId === "All" ? null : parseInt(artistId));
    };

    const handleEventTypeChange = (eventType: string) => {
        setSelectedEventType(eventType);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Calendar</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Artist Filter */}
                <Select onValueChange={handleArtistChange} defaultValue="All">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Artists</SelectItem>
                        {sampleArtists.map((artist) => (
                            <SelectItem key={artist.id} value={artist.id.toString()}>
                                {artist.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Event Type Filter */}
                <Select onValueChange={handleEventTypeChange} defaultValue="All">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {eventTypes.map((eventType) => (
                            <SelectItem key={eventType} value={eventType}>
                                {eventType}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Search Bar */}
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Calendar */}
            <Card>
                <CardHeader>
                    <CardTitle>Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                    <CustomCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
                </CardContent>
            </Card>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtered Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                <strong>{event.title}</strong> - {event.date.toDateString()} - {event.artistName} ({event.type})
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default CalendarPage;
