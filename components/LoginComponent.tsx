// components/LoginComponent.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner"; // Import toast from sonner
import LoginForm from "./LoginForm";
import AuthCard from "./AuthCard";

export default function LoginComponent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const loginEndpoint = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT;
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
                // Store the JWT token and user data in cookies
                Cookies.set("Access", data.access, { expires: 7 }); // Expires in 7 days
                Cookies.set("refresh", data.refresh, { expires: 7 }); // Expires in 7 days
                Cookies.set("role", data.role, { expires: 7 });
                Cookies.set("name", data.name, { expires: 7 });

                toast.success("Login successful", { // Use sonner's toast.success
                    description: "You are now logged in.",
                });
                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                toast.error("Login failed", { // Use sonner's toast.error
                    description: errorData.detail || "Invalid email or password.",
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("An error occurred", { // Use sonner's toast.error
                description: error.message || "There was an error logging you in.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
