"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; 
import { Separator } from "@/components/ui/separator";

// Sample Data (Replace with API Fetching)
interface Artwork {
  id: number;
  title: string;
  imageUrl: string;
  artistId: number;
  artistName: string;
  category: string;
}

const sampleArtwork: Artwork[] = [
  {
    id: 1,
    title: "Album Cover 1",
    imageUrl: "/media/album-cover-1.jpg?height=200&width=200",
    artistId: 1,
    artistName: "Taylor Swift",
    category: "Album Art"
  },
  { id: 2, title: "Promotional Photo 1", imageUrl: "/media/sᴀʙʀɪɴᴀ ᴄᴀʀᴘᴇɴᴛᴇʀ ❦.jpg?height=200&width=200", artistId: 2, artistName: "Sabrina Carpenter", category: "Promotional" },
  { id: 3, title: "Album Cover 2", imageUrl: "/media/Gracie.jpg?height=200&width=200", artistId: 3, artistName: "Gracie Abrams", category: "Album Art" },
  { id: 4, title: "Promotional Photo 2", imageUrl: "/media/olivia.jpg", artistId: 4, artistName: "Olivia Rodrigo", category: "Promotional" },
  { id: 5, title: "Album Cover 3", imageUrl: "/media/Adele.jpg?height=200&width=200", artistId: 5, artistName: "Adele", category: "Album Art" },
  { id: 6, title: "Promotional Photo 3", imageUrl: "/api/placeholder/200/200", artistId: 6, artistName: "Drake", category: "Promotional" },
  { id: 7, title: "Album Cover 4", imageUrl: "/api/placeholder/200/200", artistId: 7, artistName: "Kendrick Lamar", category: "Album Art" },
  { id: 8, title: "Promotional Photo 4", imageUrl: "/media/billie eilish.jpg?height=200&width=200", artistId: 8, artistName: "Billie Eilish", category: "Promotional" },
  { id: 9, title: "Album Cover 5", imageUrl: "/api/placeholder/200/200", artistId: 9, artistName: "Ed Sheeran", category: "Album Art" },
  { id: 10, title: "Promotional Photo 5", imageUrl: "/api/placeholder/200/200", artistId: 10, artistName: "Post Malone", category: "Promotional" },
  { id: 11, title: "Album Cover 6", imageUrl: "/api/placeholder/200/200", artistId: 11, artistName: "Zara Larsson", category: "Album Art" },
  { id: 12, title: "Promotional Photo 6", imageUrl: "/api/placeholder/200/200", artistId: 12, artistName: "Olivia Penalva", category: "Promotional" },
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

// Sample Categories (Replace with API Fetching)
const categories = ["All", "Album Art", "Promotional"];

const GalleryPage = () => {
  const { toast } = useToast();
  const [artwork, setArtwork] = useState<Artwork[]>(sampleArtwork);
  const [filteredArtwork, setFilteredArtwork] = useState<Artwork[]>(sampleArtwork);
  const [selectedArtist, setSelectedArtist] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [newArtwork, setNewArtwork] = useState<Partial<Artwork>>({});
  const [editArtwork, setEditArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    // Filter artwork based on selected artist, category, and search query
    const filtered = artwork.filter((item) => {
      const artistMatch = selectedArtist === "All" || item.artistId === parseInt(selectedArtist);
      const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchQuery.toLowerCase());
      return artistMatch && categoryMatch && searchMatch;
    });

    setFilteredArtwork(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedArtist, selectedCategory, searchQuery, artwork]);

  const handleArtistChange = (artistId: string) => setSelectedArtist(artistId);
  const handleCategoryChange = (category: string) => setSelectedCategory(category);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtwork = filteredArtwork.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredArtwork.length / itemsPerPage));

  const handleNewArtworkChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setNewArtwork((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddArtwork = () => {
    if (!newArtwork.title || !newArtwork.artistId || !newArtwork.category) {
      toast({
        title: "Error",
        description: "Please fill all the required fields.",
        variant: "destructive"
      });
      return;
    }

    const newId = artwork.length > 0 ? Math.max(...artwork.map((c) => c.id)) + 1 : 1;
    const artist = sampleArtists.find((artist) => artist.id === Number(newArtwork.artistId));

    const newArtworkWithId: Artwork = {
      id: newId,
      title: newArtwork.title || "",
      imageUrl: newArtwork.imageUrl || "/api/placeholder/200/200",
      artistId: Number(newArtwork.artistId),
      artistName: artist?.name || "Unknown Artist",
      category: newArtwork.category || "Uncategorized",
    };

    setArtwork([...artwork, newArtworkWithId]);
    setNewArtwork({});
    setOpen(false);

    toast({
      title: "Success",
      description: "Artwork added successfully."
    });
  };

  const handleEditArtwork = (item: Artwork) => {
    setEditArtwork(item);
    setNewArtwork({ ...item });
    setOpen(true);
  };

  const handleSaveEditArtwork = () => {
    if (!editArtwork || !newArtwork.title) return;

    const artist = sampleArtists.find((artist) => artist.id === Number(newArtwork.artistId));

    const updatedArtwork = artwork.map((item) =>
      item.id === editArtwork.id
        ? {
          ...item,
          title: newArtwork.title || item.title,
          imageUrl: newArtwork.imageUrl || item.imageUrl,
          artistId: Number(newArtwork.artistId) || item.artistId,
          artistName: artist?.name || item.artistName,
          category: newArtwork.category || item.category,
        }
        : item
    );

    setArtwork(updatedArtwork);
    setEditArtwork(null);
    setNewArtwork({});
    setOpen(false);

    toast({
      title: "Success",
      description: "Artwork updated successfully."
    });
  };

  const handleDeleteArtwork = (artworkId: number) => {
    const updatedArtwork = artwork.filter((item) => item.id !== artworkId);
    setArtwork(updatedArtwork);

    toast({
      title: "Success",
      description: "Artwork deleted successfully."
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artist Gallery</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Artwork
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editArtwork ? "Edit Artwork" : "Add New Artwork"}</DialogTitle>
              <DialogDescription>
                {editArtwork ? "Update the information for the artwork." : "Enter the information for the new artwork."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={newArtwork.title || ""}
                  onChange={handleNewArtworkChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={newArtwork.imageUrl || ""}
                  onChange={handleNewArtworkChange}
                  className="col-span-3"
                  placeholder="/api/placeholder/200/200"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="artistId" className="text-right">Artist *</Label>
                <Select
                  onValueChange={(value) => handleNewArtworkChange({ target: { name: "artistId", value } })}
                  value={newArtwork.artistId?.toString() || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Artist" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleArtists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id.toString()}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category *</Label>
                <Select
                  onValueChange={(value) => handleNewArtworkChange({ target: { name: "category", value } })}
                  value={newArtwork.category || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "All").map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setOpen(false);
                setNewArtwork({});
                setEditArtwork(null);
              }}>
                Cancel
              </Button>
              <Button onClick={editArtwork ? handleSaveEditArtwork : handleAddArtwork}>
                {editArtwork ? "Save Changes" : "Add Artwork"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Artist Filter */}
        <Select onValueChange={handleArtistChange} value={selectedArtist}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

        {/* Category Filter */}
        <Select onValueChange={handleCategoryChange} value={selectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
        <div className="relative flex-1 w-full">
          <Input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Separator 1: Between Filters and Artwork Grid */}
      <Separator className="my-4" />

      {/* Artwork Grid */}
      {filteredArtwork.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {paginatedArtwork.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm line-clamp-1">{item.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditArtwork(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteArtwork(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={`/api/placeholder/32/32`}
                      alt={item.artistName}
                    />
                    <AvatarFallback>
                      {item.artistName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{item.artistName}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-2 bg-muted-foreground/10">
                  <span className="text-xs font-medium">{item.category}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No artwork found matching your filters</p>
          <Button variant="outline" onClick={() => {
            setSelectedArtist("All");
            setSelectedCategory("All");
            setSearchQuery("");
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Separator 2: Between Artwork Grid and Pagination */}
      {filteredArtwork.length > 0 && <Separator className="my-4" />}

      {/* Enhanced Pagination Controls */}
      {filteredArtwork.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* First page */}
          {currentPage > 3 && (
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              onClick={() => handlePageChange(1)}
              size="sm"
              className="h-8 w-8 p-0"
            >
              1
            </Button>
          )}
          
          {/* Ellipsis if needed */}
          {currentPage > 4 && (
            <span className="mx-1">...</span>
          )}
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Calculate the page number to display
            let pageNum;
            if (currentPage <= 3) {
              // Show first 5 pages (or less if totalPages < 5)
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // Show last 5 pages (or less if totalPages < 5)
              pageNum = totalPages - Math.min(4, totalPages - 1) + i;
            } else {
              // Show current page and 2 pages before/after
              pageNum = currentPage - 2 + i;
            }
            
            // Only render if the calculated page number is valid
            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            }
            return null;
          })}
          
          {/* Ellipsis if needed */}
          {currentPage < totalPages - 3 && (
            <span className="mx-1">...</span>
          )}
          
          {/* Last page */}
          {currentPage < totalPages - 2 && totalPages > 3 && (
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              onClick={() => handlePageChange(totalPages)}
              size="sm"
              className="h-8 w-8 p-0"
            >
              {totalPages}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;