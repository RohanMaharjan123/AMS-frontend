// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
    const router = useRouter();
    const { toast } = useToast();
    const loginEndpoint = "/login";

    const handleLogout = async () => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_BASE_URL + "/logout/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: "Logout failed",
                    description: errorData.detail || "An error occurred during logout.",
                    variant: "destructive",
                });
                console.error("Logout failed");
            } else {
                toast({
                    title: "Logout successful",
                    description: "You are now logged out.",
                });
            }
        } catch (error: any) {
            toast({
                title: "An error occurred",
                description: error.message || "There was an error logging you out.",
                variant: "destructive",
            });
            console.error("Logout error:", error);
        } finally {
            Cookies.remove("Access");
            Cookies.remove("refresh");
            Cookies.remove("role");
            Cookies.remove("name");

            router.push(loginEndpoint);
        }
    };

    return (
        <DropdownMenuItem onClick={handleLogout}>
            Log out
        </DropdownMenuItem>
    );
}
