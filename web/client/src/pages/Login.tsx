import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import axios from "axios";
import loginBg from "../assets/login-bg.png";
import { useToast } from "../context/ToastContextType";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", { email, password });

      // Destructure to separate token from user data if needed, or just pass the whole object if it matches
      const { token, ...userData } = response.data;

      login(token, userData);
      showToast("success", "Login Successful!");

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Login failed";
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
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-20">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-blue-600">TravelApp</h1>
        </div>

        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-500">
            Enter your email and password to continue your journey.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div> */}
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot Your Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            Log In
          </button>
        </form>

        {/* <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or Login With</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 transition hover:bg-gray-50"
          >
            <span className="font-medium text-gray-700">Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 transition hover:bg-gray-50"
          >
            <span className="font-medium text-gray-700">Apple</span>
          </button>
        </div> */}

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't Have An Account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register Now
          </Link>
        </p>
      </div>

      {/* Right Side - Visual Panel */}
      <div className="hidden w-1/2 items-center justify-center bg-blue-600 lg:flex">
        <img
          src={loginBg}
          alt="Travel Destination"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
