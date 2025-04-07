// components/ui/use-toast.tsx
"use client"; // Add this line

import * as React from "react";
import { Toaster, toast } from "sonner";

const ToastContext = React.createContext<{
    toast: typeof toast;
} | null>(null);

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const value = React.useMemo(() => ({ toast }), []);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toaster richColors position="top-center" />
        </ToastContext.Provider>
    );
};
