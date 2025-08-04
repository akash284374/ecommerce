import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = register, 2 = otp

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await sendOtp(formData.email);
      setMessage(res.data.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp,
      });

      alert(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#d1d5f0]">
      {/* Left panel */}
      <div className="w-1/2 bg-[#0a0d2f] text-white flex flex-col justify-center items-start px-16 relative rounded-r-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            {/* <div className="w-4 h-4 rounded-full bg-blue-500" /> */}

            <span>FlexKicks</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Join the FlexKicks</h1>
        <p className="text-gray-300">Create your account today!</p>
        <footer className="absolute bottom-4 text-xs text-gray-400">
          © 2025  FlexKicks. All rights reserved.
        </footer>
      </div>

      {/* Right panel */}
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
            Register
          </h2>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h3 className="text-md mb-2">Enter the OTP sent to your email</h3>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Verify & Register
              </button>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </form>
          )}

          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
