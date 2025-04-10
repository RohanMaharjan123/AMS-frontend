// lib/api/users.ts
import { getJson } from '@/lib/apiClient';
import type { User } from '@/types/user'; // Make sure this path is correct

/**
 * Fetches a list of users from the API.
 * Assumes the API endpoint '/api/users/' returns an array of User objects.
 * @returns A promise that resolves to an array of User objects.
 * @throws {Error} If the API call fails or returns an error status.
 */
export const fetchUsers = async (): Promise<User[]> => {
    try {
        // Calling the endpoint defined in your request: http://127.0.0.1:8000/api/users/
        // getJson handles prepending the NEXT_PUBLIC_API_BASE_URL
        const users = await getJson<User[]>('/api/users/');

        // If getJson returns null (e.g., 204 No Content), return an empty array.
        // Otherwise, return the fetched users.
        return users || [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        // Re-throw the error so the calling component knows the fetch failed.
        // The component should catch this and display an error message.
        throw error;
    }
};
