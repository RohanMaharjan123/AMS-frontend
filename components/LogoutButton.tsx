// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function LogoutButton() {
    const router = useRouter();
    const loginEndpoint = "/login";

    const clientSideLogout = () => {
        Cookies.remove("Access");
        Cookies.remove("refresh");
        Cookies.remove("role");
        Cookies.remove("name");

        router.push(loginEndpoint);
    };

    const handleLogout = async () => {
        const accessToken = Cookies.get("Access");
        const refreshToken = Cookies.get("refresh"); 

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!baseUrl) {
            console.error("API Base URL is not configured.");
            toast.error("Configuration Error", { description: "API endpoint is missing." });
            clientSideLogout(); // Still logout client-side
            return;
        }
        const logoutUrl = `${baseUrl}/logout/`;

        if (!accessToken) {
            console.warn("No access token found. Performing client-side logout only.");
            clientSideLogout();
            toast.info("Client-side logout performed.");
            return;
        }

        try {
            const response = await fetch(logoutUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`, 
                },
                    body: JSON.stringify({
                    refresh: refreshToken,
                }),
            });

            if (!response.ok) {
                let errorDescription = "An error occurred during logout.";
                try {
                    const errorData = await response.json();
                    errorDescription = errorData.detail || JSON.stringify(errorData);
                    console.error("Logout API Error:", response.status, errorData);
                } catch (parseError) {
                    errorDescription = `Server responded with status ${response.status}.`;
                    console.error("Logout API Error: Status", response.status, await response.text());
                }
                toast.error("Logout failed", { description: errorDescription });
            } else {
                toast.success("Logout successful", {
                    description: "You are now logged out.",
                });
            }
        } catch (error: any) {
            console.error("Logout Fetch/Network Error:", error); 
            let description = "Network error during logout.";
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                description = "Could not connect to the server. Check network or CORS configuration.";
            } else if (error.message) {
                description = error.message; 
            }
            toast.error("Logout Error", { description });
            // Client-side logout happens in 'finally'
        } finally {
            clientSideLogout();
        }
    };

    return (
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-100 focus:text-red-700">
            Log out
        </DropdownMenuItem>
    );
}
