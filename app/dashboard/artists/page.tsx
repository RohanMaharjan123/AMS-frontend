// app/dashboard/artists/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { fetchArtists, deleteArtist } from '@/lib/api/artists'; // Adjust path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'; // For delete confirmation
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from "sonner"; // Import toast from sonner
import { debounce } from 'lodash'; // For debouncing search input
// Import Select components if you add filters
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define an interface for your artist data matching the serializer
interface Artist {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    // Add other fields displayed in the table
}

export default function ArtistsPage() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '', genres: '' }); // Add more filters
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, count: 0 }); // Example pagination state

    const loadArtists = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (filters.status) params.set('status', filters.status);
            if (filters.genres) params.set('genres', filters.genres); // Adjust param name based on backend filter
            params.set('page', page.toString());
            params.set('page_size', pagination.pageSize.toString());

            const data = await fetchArtists(params);
            setArtists(data.results || []);
            setPagination(prev => ({ ...prev, count: data.count, page: page }));
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load artists';
            setError(errorMessage);
            toast.error("Error Loading Artists", { description: errorMessage }); // Use sonner
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, filters, pagination.pageSize]); // Dependencies for useCallback

    // Debounced search handler
    const debouncedSearch = useCallback(debounce((term: string) => {
         setSearchTerm(term);
         setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 500), []); // 500ms debounce

    useEffect(() => {
        loadArtists(pagination.page);
    }, [loadArtists, pagination.page]); // Reload when loadArtists function or page changes

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
    };

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
         setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteArtist(id);
            toast.success("Success", { description: "Artist deleted successfully." }); // Use sonner
            // Reload artists after deletion - reset to page 1 if current page might become empty
            const newTotalPages = Math.ceil((pagination.count - 1) / pagination.pageSize);
            const currentPage = (pagination.page > newTotalPages && newTotalPages > 0) ? newTotalPages : pagination.page;
            loadArtists(currentPage);
        } catch (err: any) {
             const errorMessage = err.message || 'Failed to delete artist';
             toast.error("Error Deleting Artist", { description: errorMessage }); // Use sonner
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Artists</h1>
                <Button asChild>
                    <Link href="/dashboard/artists/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Artist
                    </Link>
                </Button>
            </div>

            {/* Filter and Search Section */}
            <div className="flex gap-4 items-center">
                 <Input
                    placeholder="Search by name, email..."
                    onChange={handleSearchChange}
                    className="max-w-sm"
                />
                {/* Add Select components for filters (status, genre, etc.) */}
                {/* Example Status Filter:
                <Select onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-[180px]"> <SelectValue placeholder="Filter by Status" /> </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                </Select>
                */}
            </div>

            {isLoading && <p>Loading artists...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {artists.length > 0 ? artists.map((artist) => (
                                <TableRow key={artist.id}>
                                    <TableCell>{artist.first_name} {artist.last_name}</TableCell>
                                    <TableCell>{artist.email}</TableCell>
                                    <TableCell>{artist.status}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/artists/${artist.id}/edit`}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    {/* <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/artists/${artist.id}`}>View</Link>
                                                    </DropdownMenuItem> */}
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the artist profile.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(artist.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No artists found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {/* Add Pagination Controls Here */}
                    {/* Example Pagination:
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadArtists(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                        >
                            Previous
                        </Button>
                        <span>Page {pagination.page} of {Math.ceil(pagination.count / pagination.pageSize)}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadArtists(pagination.page + 1)}
                            disabled={pagination.page >= Math.ceil(pagination.count / pagination.pageSize)}
                        >
                            Next
                        </Button>
                    </div>
                     */}
                </>
            )}
        </div>
    );
}
