// components/LoginComponent.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import LoginForm from "./LoginForm";
import AuthCard from "./AuthCard";

export default function LoginComponent() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // Use the formData state
            });

            if (response.ok) {
                const data = await response.json();
                // Store the JWT token in local storage or a cookie
                localStorage.setItem("Access", data.access);
                localStorage.setItem("refresh", data.refresh);
                localStorage.setItem("role", data.role); // Make sure this line is present
                localStorage.setItem("name", data.name); // Store the user's name
                toast({
                    title: "Login successful",
                    description: "You are now logged in.",
                });
                router.push("/dashboard");
            } else {
                const errorData = await response.json();
                toast({
                    title: "Login failed",
                    description: errorData.detail || "Invalid email or password.", // Use errorData.detail
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast({
                title: "An error occurred",
                description: error.message || "There was an error logging you in.",
                variant: "destructive",
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
                formData={formData} // Pass formData
                handleChange={handleChange} // Pass handleChange
            />
        </AuthCard>
    );
}
