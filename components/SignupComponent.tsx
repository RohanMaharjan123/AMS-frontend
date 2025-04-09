// components/SignupComponent.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Import toast from sonner
import AuthCard from "./AuthCard";
import SignupForm from "./SignupForm";

// Define schema
const formSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirm_password: z.string().min(8, { message: "Confirm password must be at least 8 characters." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    dob: z.date({ required_error: "A date of birth is required." }),
    gender: z.string({ required_error: "Please select a gender." }),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
    role: z.string({ required_error: "Please select a role." }),
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupComponent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [calendarDisplayDate, setCalendarDisplayDate] = useState<Date>(new Date());

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            phone: "",
            dob: undefined,
            gender: undefined,
            address: "",
            role: undefined,
        },
    });

    useEffect(() => {
        const defaultDob = form.getValues("dob");
        if (defaultDob) {
            setCalendarDisplayDate(defaultDob);
        }
    }, [form]);

    const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
        setIsLoading(true);
        console.log("Form Data Submitted:", data);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const signupEndpoint = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT;

            if (!baseUrl || !signupEndpoint) {
                console.error("API URL or Signup Endpoint is not defined.");
                toast.error("Configuration Error", { description: "API endpoint missing." }); // Use sonner
                setIsLoading(false);
                return;
            }

            const apiUrl = `${baseUrl}${signupEndpoint}`;

            const requestBody = {
                ...data,
                dob: data.dob ? format(data.dob, "yyyy-MM-dd") : null,
            };
            console.log("Request Body:", JSON.stringify(requestBody));

            const csrftoken = Cookies.get('csrftoken');

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(csrftoken && { 'X-CSRFToken': csrftoken }),
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                toast.success("Account created", { // Use sonner
                    description: "Please log in.",
                });
                router.push("/login"); // Redirect here after successful signup
            } else {
                let errorData: any = {};
                let errorMessage = `Signup failed (${response.status})`;
                try {
                    errorData = await response.json();
                    console.error("Signup API Error Response:", errorData);

                    const fieldErrors = Object.entries(errorData)
                        .filter(([key]) => key !== 'status_code')
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('; ');

                    if (fieldErrors) {
                        errorMessage = fieldErrors;
                    } else if (errorData.detail) {
                        errorMessage = errorData.detail;
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.non_field_errors) {
                        errorMessage = errorData.non_field_errors.join(", ");
                    } else {
                        errorMessage = JSON.stringify(errorData);
                    }

                } catch (parseError) {
                    console.error("Failed to parse error response:", parseError);
                    errorMessage = `Signup failed with status: ${response.status} ${response.statusText}. Could not parse error details.`;
                }

                toast.error("Signup failed", { // Use sonner
                    description: errorMessage,
                });
            }
        } catch (error: any) {
            console.error("Signup Fetch/Network Error:", error);
            toast.error("Network Error", { // Use sonner
                description: error.message || "Could not connect to the server.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleYearChange = (year: string) => {
        const newYear = parseInt(year, 10);
        setCalendarDisplayDate(prev => new Date(newYear, prev.getMonth(), 1));
    };

    const handleMonthChange = (month: string) => {
        const newMonth = parseInt(month, 10) - 1;
        setCalendarDisplayDate(prev => new Date(prev.getFullYear(), newMonth, 1));
    };

    return (
        <AuthCard
            title="Create an account"
            description="Enter your information to create your account"
            isLogin={false}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <SignupForm
                        form={form}
                        calendarDisplayDate={calendarDisplayDate}
                        handleYearChange={handleYearChange}
                        handleMonthChange={handleMonthChange}
                        setCalendarDisplayDate={setCalendarDisplayDate}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    );
}
