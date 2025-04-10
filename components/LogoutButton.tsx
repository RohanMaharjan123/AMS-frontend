// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { sendJson } from "@/lib/apiClient";

export function LogoutButton() {
    const router = useRouter();
    const loginEndpoint = "/login";

    const clientSideLogout = () => {
        Cookies.remove("Access", { path: '/' });
        Cookies.remove("refresh", { path: '/' });
        Cookies.remove("role", { path: '/' });
        Cookies.remove("name", { path: '/' });
    };

    const handleLogout = async () => {
        const refreshToken = Cookies.get("refresh");
        const logoutEndpoint = '/logout/'; // Relative endpoint

        if (!refreshToken) {
            console.warn("No refresh token found. Performing client-side logout only.");
            clientSideLogout();
            router.push(loginEndpoint);
            toast.info("Logged out (client-side only).");
            return;
        }

        try {
            await sendJson(logoutEndpoint, 'POST', { refresh: refreshToken });

            toast.success("Logout successful", {
                description: "You have been logged out.",
            });
            clientSideLogout();
            router.push(loginEndpoint);

        } catch (error: any) {
            if (error.message === 'Unauthorized') {
                console.log("Logout failed due to unauthorized, redirection handled.");
                clientSideLogout();
            } else {
                console.error("Logout Error:", error);
                toast.error("Logout Failed", {
                    description: error.message || "Could not log out.",
                });
                clientSideLogout();
            }
        }
    };

    return (
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-100 focus:text-red-700 cursor-pointer">
            Log out
        </DropdownMenuItem>
    );
}
