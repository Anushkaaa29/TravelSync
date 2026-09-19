import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api/axiosInstance";
import { useToast } from "../context/ToastContextType";
import loginBg from "../assets/login-bg.png";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { resetToken } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("error", "Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await API.put(`/auth/resetpassword/${resetToken}`, { password });
            showToast("success", "Password updated! Please login.");
            navigate("/login");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                showToast("error", err.response?.data?.message || "Invalid or expired token");
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
                    <h2 className="mb-2 text-3xl font-bold text-gray-900">Reset Password</h2>
                    <p className="text-gray-500">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300"
                    >
                        {loading ? "Updating..." : "Update Password"}
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

export default ResetPassword;
