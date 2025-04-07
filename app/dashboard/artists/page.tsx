"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample Data (Replace with API Fetching)
interface Artist {
  id: number;
  name: string;
  avatar: string;
  category: string;
  status: "Active" | "Inactive";
  album: number;
}

const sampleArtists: Artist[] = [
  {
    id: 1,
    name: "Taylor Swift",
    avatar: "/media/Taylor.jpg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 11,
  },
  {
    id: 2,
    name: "Sabrina Carpenter",
    avatar: "/media/Sabrina.jpg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 3,
  },
  {
    id: 3,
    name: "Gracie Abrams",
    avatar: "/media/Gracieprofile0.jpg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 2,
  },
  {
    id: 4,
    name: "Olivia Rodrigo",
    avatar: "/media/Oliviaprofile.jpg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 7,
  },
  {
    id: 5,
    name: "Adele",
    avatar: "/media/Adeleprofile.jpg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 7,
  },
  {
    id: 6,
    name: "Drake",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Rapper",
    status: "Active",
    album: 10,
  },
  {
    id: 7,
    name: "Kendrick Lamar",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Rapper",
    status: "Active",
    album: 5,
  },
  {
    id: 8,
    name: "Billie Eilish",
    avatar: "/media/billie eilish.jpg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 3,
  },
  {
    id: 9,
    name: "Ed Sheeran",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Singer-songwriter",
    status: "Active",
    album: 6,
  },
  {
    id: 10,
    name: "Post Malone",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Rapper",
    status: "Active",
    album: 4,
  },
];

// Sample Categories (Replace with API Fetching)
const categories = ["All", "Singer-songwriter", "Rapper", "Pop", "Rock"];

const ArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>(sampleArtists);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Filter artists based on selected category and search query
    const filteredArtists = sampleArtists.filter((artist) => {
      const categoryMatch =
        selectedCategory === "All" || artist.category === selectedCategory;
      const searchMatch = artist.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
    setArtists(filteredArtists);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artists</h1>
        <Link href="/dashboard/artists/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Artist
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Category Filter */}
        <Select onValueChange={handleCategoryChange} defaultValue="All">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Search Bar */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Artist List */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artist</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Album</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.map((artist) => (
            <TableRow key={artist.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>
                    {artist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {artist.name}
              </TableCell>
              <TableCell>{artist.category}</TableCell>
              <TableCell>{artist.status}</TableCell>
              <TableCell>{artist.album}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArtistsPage;
