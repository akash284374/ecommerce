import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // Login states
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password states
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  // Handle login input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData);
      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleSendOtp = async () => {
    if (!fpEmail) {
      setFpError("Please enter your email");
      return;
    }
    setFpError("");
    setFpLoading(true);
    try {
      await sendForgotPasswordOtp(fpEmail);
      alert("OTP sent to your email");
      setFpStep(2);
    } catch (err) {
      setFpError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!fpOtp) {
      setFpError("Please enter the OTP");
      return;
    }
    setFpError("");
    setFpLoading(true);
    try {
      await verifyForgotPasswordOtp({ email: fpEmail, otp: fpOtp });
      alert("OTP verified");
      setFpStep(3);
    } catch (err) {
      setFpError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setFpError("Please fill both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFpError("Passwords do not match");
      return;
    }
    setFpError("");
    setFpLoading(true);
    try {
      await resetPassword({ email: fpEmail, newPassword, confirmPassword });
      alert("Password updated successfully");
      setShowForgot(false);
      setFpStep(1);
      // Clear forgot password form
      setFpEmail("");
      setFpOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFpError(err.response?.data?.message || "Error updating password");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#d1d5f0]">
      {/* Left panel */}
      <div className="w-1/2 bg-[#0a0d2f] text-white flex flex-col justify-center items-start px-16 relative rounded-r-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <span>FlexKicks</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Login into your account</h1>
        <p className="text-gray-300">Let us make the FlexKicks bigger!</p>
        <footer className="absolute bottom-4 text-xs text-gray-400">
          © 2025 FlexKicks. All rights reserved.
        </footer>
      </div>

      {/* Right panel */}
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-sm">
          {!showForgot ? (
            <>
              <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Login</h2>

              {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-sm text-gray-500 cursor-pointer select-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`p-3 rounded-lg text-white font-medium transition ${
                      loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setError("");
                      setFpError("");
                      setFpStep(1);
                      setFpEmail("");
                      setFpOtp("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                Reset Password
              </h2>

              {fpError && <p className="text-red-600 text-sm mb-4 text-center">{fpError}</p>}

              {fpStep === 1 && (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={fpLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                  >
                    {fpLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {fpStep === 2 && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={fpOtp}
                    onChange={(e) => setFpOtp(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={fpLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg"
                  >
                    {fpLoading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </>
              )}

              {fpStep === 3 && (
                <>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleResetPassword}
                    disabled={fpLoading}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg"
                  >
                    {fpLoading ? "Updating Password..." : "Update Password"}
                  </button>
                </>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="text-center text-sm text-gray-500 hover:underline mt-4"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
