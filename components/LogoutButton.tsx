"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("Access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        // Redirect to login page
        router.push("/login");
    };

    return (
        <DropdownMenuItem onClick={handleLogout}>
            Log out
        </DropdownMenuItem>
    );
}
