// components/LoginComponent.tsx
"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import LoginForm from "./LoginForm";
import AuthCard from "./AuthCard";

export default function LoginComponent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const accessToken = Cookies.get("Access");
        if (accessToken) {
            console.log("User already logged in. Redirecting to dashboard.");
            router.replace("/dashboard");
        }
    }, [router]); // Include router in the dependency array

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const loginEndpoint = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT;

            if (!baseUrl || !loginEndpoint) {
                console.error("API configuration is missing.");
                toast.error("Configuration Error", { description: "Cannot connect to the login service." });
                setIsLoading(false);
                return;
            }

            const apiUrl = `${baseUrl}${loginEndpoint}`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                const cookieOptions = { expires: 7, path: '/' }; // Example options
                Cookies.set("Access", data.access, cookieOptions);
                Cookies.set("refresh", data.refresh, cookieOptions);
                Cookies.set("role", data.role, cookieOptions);
                Cookies.set("name", data.name, cookieOptions);

                toast.success("Login successful", {
                    description: "Redirecting to your dashboard...",
                });
                router.push("/dashboard");
            } else {
                const errorData = await response.json().catch(() => ({ detail: "Invalid email or password." })); // Add catch for non-JSON errors
                toast.error("Login failed", {
                    description: errorData.detail || `Error: ${response.status}`,
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("An error occurred", {
                description: error.message || "Could not connect to the server.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (Cookies.get("Access")) {
        return null; // Or a loading indicator
    }

    return (
        <AuthCard
            title="Artist Management"
            description="Enter your email and password to login to your account"
            isLogin={true}
        >
            <LoginForm
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                formData={formData}
                handleChange={handleChange}
            />
        </AuthCard>
    );
}
