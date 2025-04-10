export interface User {
    id: number;
    username: string; // Or maybe email? Adjust as needed
    first_name: string;
    last_name: string;
    email: string;
    role: string; // Assuming role is returned
    // Add other relevant fields returned by your API
}