// /app/dashboard/users/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getJson } from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCog, ShieldCheck } from 'lucide-react';
import { toast } from "sonner";

// Interface for the user data from /api/users/
interface ApiUser {
    id: string | number;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    role: 'artist' | 'artist_manager';
    first_name?: string; // Optional first name
    last_name?: string;  // Optional last name
}

// Interface for the data structure expected by the DataTable
interface DisplayUser {
    id: string | number;
    name: string;
    email: string;
    role: 'artist' | 'artist_manager';
    status: 'active' | 'inactive'; // Mapped from is_active
    created_at: string; // Mapped from date_joined
    is_staff: boolean;
}

interface UserCounts {
    total_users: number;
    total_artists: number;
    total_managers: number;
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<DisplayUser[]>([]);
    const [counts, setCounts] = useState<UserCounts | null>(null);
    const [loadingUsers, setLoadingUsers] = useState(true); // Single loading state
    const [error, setError] = useState<string | null>(null); // General error state

    useEffect(() => {
        const fetchData = async () => {
            setLoadingUsers(true);
            setError(null);
            setCounts(null);
            try {
                console.log("Fetching user data...");
                const usersData = await getJson<ApiUser[]>('/api/users/');

                console.log("API User Data Received:", usersData);
                const processedUsers = (usersData || []).map(apiUser => ({
                    id: apiUser.id,
                    email: apiUser.email,
                    name: apiUser.first_name && apiUser.last_name
                        ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
                        : apiUser.email.split('@')[0] || apiUser.email, // Fallback logic
                    role: apiUser.role, // Pass the role directly
                    status: apiUser.is_active ? 'active' : 'inactive',
                    created_at: apiUser.date_joined,
                    is_staff: apiUser.is_staff,
                }));
                console.log("Processed Users for Table:", processedUsers);
                setUsers(processedUsers);

                // Calculate counts from the processed user list
                const calculatedCounts: UserCounts = {
                    total_users: 0,
                    total_artists: 0,
                    total_managers: 0,
                };
                if (processedUsers.length > 0) {
                    calculatedCounts.total_users = processedUsers.length;
                    calculatedCounts.total_artists = processedUsers.filter(u => u.role === 'artist').length;
                    calculatedCounts.total_managers = processedUsers.filter(u => u.role === 'artist_manager').length;
                }
                console.log("Calculated Counts:", calculatedCounts);
                setCounts(calculatedCounts); 
            } catch (err: any) {
                console.error("Error during data fetching:", err);
                if (err.message !== 'Unauthorized') {
                    const errorMessage = err.message || "An unexpected error occurred.";
                    setError(errorMessage);
                    toast.error("Error Loading Data", { description: errorMessage });
                }
                setUsers([]);
                setCounts(null);
            } finally {
                setLoadingUsers(false);
                console.log("Data fetching finished.");
            }
        };

        fetchData();
    }, []); 
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total Users Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/*  skeleton component */}
                        {loadingUsers ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : counts !== null ? (
                            <div className="text-2xl font-bold">{counts.total_users}</div>
                        ) : (
                            <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                        )}
                    </CardContent>
                </Card>

                {/* Total Artists Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loadingUsers ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : counts !== null ? (
                            <div className="text-2xl font-bold">{counts.total_artists}</div>
                        ) : (
                            <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                        )}
                    </CardContent>
                </Card>

                {/* Total Managers Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loadingUsers ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : counts !== null ? (
                            <div className="text-2xl font-bold">{counts.total_managers}</div>
                        ) : (
                            <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* End Stats Cards Section */}

            {/* User Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users List</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && !loadingUsers && (
                        <p className="text-center text-red-500 py-4">{error}</p>
                    )}
                    {loadingUsers ? (
                        // Skeleton loader for the table
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-full rounded-md" /> {/* Filter/Columns row */}
                            <Skeleton className="h-10 w-full rounded-md" /> {/* Header row */}
                            <Skeleton className="h-12 w-full rounded-md" /> {/* Data row */}
                            <Skeleton className="h-12 w-full rounded-md" /> {/* Data row */}
                            <Skeleton className="h-12 w-full rounded-md" /> {/* Data row */}
                            <Skeleton className="h-10 w-full rounded-md" /> {/* Pagination row */}
                        </div>
                    ) : !error ? ( 
                        <DataTable
                            columns={columns}
                            data={users} 
                            enableFiltering={true}
                            filterColumnId="name"
                            filterPlaceholder="Filter by name..." 
                            enablePagination={true}
                            enableColumnVisibility={true}
                        />
                    ) : null
                    }
                    {!loadingUsers && !error && users.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No users found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagementPage;
