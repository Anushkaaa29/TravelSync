import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import axios from "axios";
import loginBg from "../assets/login-bg.png";
import { useToast } from "../context/ToastContextType";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      // Send request to our Express backend
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      // Save the token and role (Assuming backend sends them on register too,
      // typically we might want to auto-login or redirect to login.
      // For now, let's redirect to login to be safe/standard flow)
      // If your backend Auto-Logins, you can store tokens here.
      // Based on authController, it returns _id, name, email, role, message
      // It DOES NOT return a token. So we must redirect to login.

      showToast("success", "Account created successfully! Please Login.");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Registration failed";
        setError(msg);
        showToast("error", msg);
      } else {
        setError("An unexpected error occurred");
        showToast("error", "An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Register Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-20 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-blue-600">TravelApp</h1>
        </div>

        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500">
            Join us to explore dream destinations.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>

      {/* Right Side - Visual Panel */}
      <div className="hidden w-1/2 items-center justify-center bg-blue-600 lg:flex h-full">
        <img
          src={loginBg}
          alt="Travel Destination"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
