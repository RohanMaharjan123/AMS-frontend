// Example structure for app/dashboard/artists/[artistId]/edit/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchArtist, updateArtist, fetchGenres, fetchSkills } from '@/lib/api/artists'; // Adjust path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner"; // Import toast from sonner
// Import multi-select component if needed for genres/skills

// Zod schema matching your ArtistSerializer fields
const artistFormSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    // social_links: z.record(z.string().url()).optional(), // Example for JSON
    status: z.enum(['active', 'inactive', 'prospect']),
    // Add genres, skills (might need custom validation or transform for multi-select)
    // date_of_birth, gender, address if editable
});

type ArtistFormValues = z.infer<typeof artistFormSchema>;

export default function EditArtistPage() {
    const params = useParams();
    const router = useRouter();
    const artistId = params.artistId as string;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    // State for genres/skills options if using dropdowns
    // const [genreOptions, setGenreOptions] = useState<{ id: string, name: string }[]>([]);

    const form = useForm<ArtistFormValues>({
        resolver: zodResolver(artistFormSchema),
        defaultValues: { // Initialize with empty or default values
            first_name: '',
            last_name: '',
            phone: '',
            bio: '',
            website: '',
            status: 'active',
        },
    });

    useEffect(() => {
        if (!artistId) return;
        setIsFetching(true);
        // Fetch existing artist data
        fetchArtist(artistId)
            .then(data => {
                // Pre-populate form - ensure data keys match schema keys
                form.reset({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    phone: data.phone || '',
                    bio: data.bio || '',
                    website: data.website || '',
                    status: data.status,
                    // Handle genres/skills pre-population (might need transformation)
                });
            })
            .catch(err => {
                toast.error("Error", { description: "Failed to load artist data." }); // Use sonner
            })
            .finally(() => setIsFetching(false));

        // Fetch genres/skills for dropdowns
        // fetchGenres().then(setGenreOptions).catch(...);

    }, [artistId, form]);

    const onSubmit = async (values: ArtistFormValues) => {
        setIsLoading(true);
        try {
            // Prepare data (e.g., handle social_links JSON)
            await updateArtist(artistId, values);
            toast.success("Success", { description: "Artist updated successfully." }); // Use sonner
            router.push('/dashboard/artists'); // Redirect after success
        } catch (err: any) {
            try {
                const errorDetails = JSON.parse(err.message);
                // Attempt to set form errors based on backend response
                Object.keys(errorDetails).forEach((key) => {
                    form.setError(key as keyof ArtistFormValues, {
                        type: 'server',
                        message: Array.isArray(errorDetails[key]) ? errorDetails[key].join(', ') : errorDetails[key],
                    });
                });
                 toast.error("Update Failed", { description: "Please check the form errors." }); // Use sonner
            } catch {
                // Fallback if error message is not JSON
                toast.error("Error", { description: err.message || 'Failed to update artist' }); // Use sonner
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <p>Loading artist details...</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Edit Artist</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Example FormField for first_name */}
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Artist's first name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Add FormFields for last_name, bio, phone, status (Select), website, etc. */}
                    {/* Example Status Select */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger> <SelectValue placeholder="Select status" /> </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="prospect">Prospect</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Add fields for genres, skills (potentially using a multi-select component) */}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
