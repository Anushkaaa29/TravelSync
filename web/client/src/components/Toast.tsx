import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type ToastType = "success" | "error";

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

export const Toast = ({ type, message, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Auto-dismiss time

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-green-100 border-green-200 text-green-800",
        error: "bg-red-100 border-red-200 text-red-800",
    };

    const Icon = type === "success" ? CheckCircle : XCircle;
    const iconColor = type === "success" ? "text-green-500" : "text-red-500";
    const title = type === "success" ? "Success" : "Error";

    return (
        <div
            className={cn(
                "fixed right-5 top-5 z-50 flex w-auto min-w-[320px] max-w-md animate-in slide-in-from-right-full items-start gap-3 rounded-2xl border p-4 shadow-lg transition-all duration-300",
                styles[type]
            )}
        >
            {/* Icon Circle */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Icon className={cn("h-6 w-6", iconColor)} />
            </div>

            <div className="flex-1 pt-0.5">
                <h3 className="text-lg font-bold leading-tight">{title}</h3>
                <p className="mt-1 text-sm font-medium opacity-90">{message}</p>
            </div>

            <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
};
