// components/UserList.tsx (or any other component file)
"use client"; // Mark as a Client Component

import React, { useState, useEffect } from 'react';
import { fetchUsers } from '@/lib/api/users'; // Adjust path
import type { User } from '@/types/user'; // Adjust path
import { toast } from 'sonner'; // For displaying errors

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedUsers = await fetchUsers();
                setUsers(fetchedUsers);
            } catch (err: any) {
                console.error("Error loading users in component:", err);
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                toast.error("Failed to load users", { description: errorMessage });
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []); // Empty dependency array ensures this runs once on mount

    if (isLoading) {
        return <div>Loading users...</div>; // Replace with a spinner or skeleton loader
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error loading users: {error}</div>;
    }

    if (users.length === 0) {
        return <div>No users found.</div>;
    }

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.first_name} {user.last_name} ({user.email}) - Role: {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
