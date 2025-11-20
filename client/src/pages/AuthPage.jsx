import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  // --- Utility Function for Advanced Toast Styling ---
  const showToast = (type, message) => {
    const toastOptions = {
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        padding: "16px",
        fontWeight: "bold",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#333",
      },
    };

    if (type === "success") {
      toast.success(message, toastOptions);
    } else if (type === "error") {
      toast.error(message, {
        ...toastOptions,
        style: { ...toastOptions.style, background: "#d32f2f" }, // Dark Red background for error
      });
    } else if (type === "validation") {
      // Custom toast for validation errors (e.g., using toast.error)
      toast.error(message, {
        ...toastOptions,
        style: { ...toastOptions.style, background: "#ff9800" }, // Orange background for warning/validation
        icon: "⚠️",
      });
    }
  };
  // ----------------------------------------------------

  async function handleRegister(e) {
    e.preventDefault();

    // --- Client-Side Validation for Registration ---
    if (!data.userName.trim() || !data.email.trim() || !data.password.trim()) {
      showToast("validation", "All fields are required for registration.");
      return;
    }
    if (data.password.length < 5) {
      showToast("validation", "Password must be at least 6 characters long.");
      return;
    }
    // Simple Email Check (Advanced email validation usually requires a library or regex)
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      showToast("validation", "Please enter a valid email address.");
      return;
    }
    // ---------------------------------------------

    try {
      const responce = await axios.post(
        "https://movie-project-backend-ufco.onrender.com/user/registration",
        data
      );

      showToast(
        "success",
        responce.data.message || "Account created successfully. Please login."
      );

      setData({
        userName: "",
        email: "",
        password: "",
      });
      setActiveTab("login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please check your network and try again.";
      showToast("error", errorMessage);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    // --- Client-Side Validation for Login ---
    if (!data.email.trim() || !data.password.trim()) {
      showToast("validation", "Email and Password are required for login.");
      return;
    }
    // ---------------------------------------

    try {
      const responce = await axios.post(
        "https://movie-project-backend-ufco.onrender.com/user/login",
        { email: data.email, password: data.password } // Only sending required data
      );

      showToast(
        "success",
        responce.data.message || "Login successful! Welcome back."
      );

      login(responce.data.myToken);
      setData({
        email: "",
        password: "",
      });
      navigate("/movies");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      showToast("error", errorMessage);
    }
  }

  // Handle input change for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 px-4">
      {/* Toaster component to show toasts */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Tabs */}
        <div className="flex">
          <button
            className={`w-1/2 py-3 text-lg font-medium ${
              activeTab === "login"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-3 text-lg font-medium ${
              activeTab === "signup"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form Section */}
        <div className="p-6 text-black">
          {activeTab === "login" ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
              {/* Form elements use 'name' and call generic handler */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.email}
                onChange={handleInputChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.password}
                onChange={handleInputChange}
              />

              <button
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                onClick={handleLogin}
              >
                Login
              </button>
              <p className="text-sm text-black mt-3 text-center">
                Don’t have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer font-medium"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </span>
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Account</h2>
              <input
                type="text"
                name="userName"
                placeholder="Full Name"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.userName}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.password}
                onChange={handleInputChange}
              />
              <button
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                onClick={handleRegister}
              >
                Sign Up
              </button>
              <p className="text-sm text-black mt-3 text-center">
                Already have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer font-medium"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </span>
              </p>
            </div>
          )}

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-black hover:text-red-600 text-sm underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
