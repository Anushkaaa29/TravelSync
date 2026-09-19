
import { useState, useEffect } from "react";
import { User, FileText, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axiosInstance";
import { useToast } from "../context/ToastContextType";

const UserProfile = () => {
    const { user, login } = useAuth();
    const { showToast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // NOTE: We need a backend endpoint to update user profile. 
            // Current auth logic doesn't have "update profile" endpoint.
            // I will assume /auth/profile or /auth/update-details exists or I need to create it.
            // Wait, I didn't create it in backend!
            // Let's create it first? Or just mock it for now? 
            // The instructions said "Create User Profile page". It implies functionality.
            // I'll create the backend endpoint quickly.

            const response = await API.put("/auth/profile", { name });

            // Update local context
            // login function expects token + user data.
            // I can re-use the existing token or get a new one.
            // Simplest is to update the user object in context if I had a setUser method exposed...
            // but `login` overwrites everything.

            const updatedUser = { ...user!, name: response.data.name };
            // Reuse existing token from storage since backend probably didn't issue new one, or did it?
            const token = localStorage.getItem("token") || "";
            login(token, updatedUser);

            showToast("success", "Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Profile update failed", error);
            showToast("error", "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-lg p-6">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">My Profile</h1>

            <div className="rounded-xl bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User className="h-12 w-12" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500">
                            <Mail className="h-5 w-5" />
                            <span>{email}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className={`block w-full rounded-lg border p-3 pl-11 text-gray-900 focus:outline-none focus:ring-1 ${isEditing
                                        ? "border-blue-500 focus:ring-blue-500 bg-white"
                                        : "border-gray-200 bg-gray-50"
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
