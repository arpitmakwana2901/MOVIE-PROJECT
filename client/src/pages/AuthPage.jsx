import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const responce = await axios.post(
        "http://localhost:3690/user/registration",
        data
      );
      alert(responce.data.message);
      setData({
        userName: "",
        email: "",
        password: "",
      });
      setActiveTab("login");
    } catch (error) {
      alert("Error", error.message);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const responce = await axios.post(
        "http://localhost:3690/user/login",
        data
      );
      console.log(responce);
      alert(responce.data.message);
      login(responce.data.myToken);
      setData({
        email: "",
        password: "",
      });
      navigate("/movies");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 px-4">
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
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
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
                placeholder="Full Name"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.userName}
                onChange={(e) => setData({ ...data, userName: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
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
