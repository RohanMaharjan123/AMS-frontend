// /app/dashboard/users/[userid]/edit/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getJson, sendJson } from '@/lib/apiClient';
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';

// Define the User type again or import it
interface User {
    id: string | number;
    name: string;
    email: string;
    role: 'artist' | 'artist_manager' | 'super_admin';
    status: 'active' | 'inactive';
    // Add other editable fields
}

const EditUserPage = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.userid; // Get user ID from URL

    const [user, setUser] = useState<Partial<User>>({}); // Use Partial for initial state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Adjust endpoint to fetch a single user
                const userData = await getJson<User>(`/users/${userId}/`);
                setUser(userData);
            } catch (err: any) {
                console.error("Failed to fetch user data:", err);
                if (err.message !== 'Unauthorized') {
                    setError("Failed to load user data.");
                    toast.error("Error", { description: "Could not load user details." });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSaving(true);
        setError(null);

        try {
            // Adjust endpoint and method (PUT or PATCH)
            const updatedUser = await sendJson<User>(`/users/${userId}/`, 'PATCH', user); // Or PUT
            setUser(updatedUser); // Update state with response from server
            toast.success("User Updated", { description: `${user.name}'s details saved successfully.` });
            // Optionally redirect back to the user list
            // router.push('/dashboard/users');
        } catch (err: any) {
            console.error("Failed to update user:", err);
            if (err.message !== 'Unauthorized') {
                setError("Failed to save changes.");
                toast.error("Update Failed", { description: err.message || "Could not save user details." });
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        );
    }

    if (error && !user.id) { // Show error prominently if user data couldn't load
        return <p className="text-red-500 text-center">{error}</p>;
    }


    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit User: {user?.name || 'Loading...'}</CardTitle>
                <CardDescription>Update the user's details below.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={user.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={user.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                name="role"
                                value={user.role || ''}
                                onValueChange={(value) => handleSelectChange("role", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="artist">Artist</SelectItem>
                                    <SelectItem value="artist_manager">Artist Manager</SelectItem>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                name="status"
                                value={user.status || ''}
                                onValueChange={(value) => handleSelectChange("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Add other fields as needed */}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default EditUserPage;
