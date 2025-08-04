// src/pages/OtpVerification.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService"; // This is correct

export default function OtpVerification() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            await verifyOtp({ ...state, otp });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleVerify} className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-green-600 text-white p-2 w-full rounded">
                    Verify & Register
                </button>
            </form>
        </div>
    );
}
