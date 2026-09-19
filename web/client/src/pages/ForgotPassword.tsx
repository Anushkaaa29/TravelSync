import React, { useState } from "react";
import axios from "axios";
import API from "../api/axiosInstance";
import { useToast } from "../context/ToastContextType";
import loginBg from "../assets/login-bg.png"; // Reusing login background

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/auth/forgotpassword", { email });
            showToast("success", "Email sent! Check your inbox.");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                showToast("error", err.response?.data?.message || "Something went wrong");
            } else {
                showToast("error", "An unexpected error occurred");
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-blue-600">TravelApp</h1>
                </div>

                <div className="mb-8">
                    <h2 className="mb-2 text-3xl font-bold text-gray-900">Forgot Password</h2>
                    <p className="text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>

            {/* Right Side - Visual Panel */}
            <div className="hidden w-1/2 items-center justify-center bg-blue-600 lg:flex">
                <img src={loginBg} alt="Travel Destination" className="h-full w-full object-cover" />
            </div>
        </div>
    );
};

export default ForgotPassword;
