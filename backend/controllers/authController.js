import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

// Create JWT token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update OTP only
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      // Create new user with just email & OTP
      user = new User({ email, otp, otpExpiry });
    }

    await user.save();

    await sendEmail(
      email,
      "Your OTP Code",
      `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP
// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     res.status(200).json({ message: "OTP verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, name, username, password } = req.body;

    if (!email || !otp || !name || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user
    user.name = name;
    user.username = username;
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Register
// export const register = async (req, res) => {
//   try {
//     const { name, username, email, password, otp } = req.body;

//     if (!name || !username || !email || !password || !otp) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // Prevent re-registering
//     if (user.password && user.name && user.username) {
//       return res.status(400).json({ message: "User already registered" });
//     }

//     user.name = name;
//     user.username = username;
//     user.password = await bcrypt.hash(password, 10);
//     user.otp = undefined;
//     user.otpExpiry = undefined;

//     await user.save();

//     const token = createToken(user._id);

//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .status(201)
//       .json({
//         message: "Registered successfully",
//         user: {
//           id: user._id,
//           name: user.name,
//           username: user.username,
//           email: user.email,
//           role: user.role,
//         },
//       });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const register = async (req, res) => {
  try {
    const { name, username, email, password, otp } = req.body;

    if (!name || !username || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Prevent re-registering
    if (user.password && user.name && user.username) {
      return res.status(400).json({ message: "User already registered" });
    }

    // ✅ Save user details
    user.name = name;
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    console.log("✅ Final saved user:", user);

    const token = createToken(user._id);

    res
      .status(201)
      .json({
        message: "Registered successfully",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token
      });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });

    if (!user || !user.password)
      return res.status(400).json({ message: "User not found or password not set" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user._id);

    res
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  res
    .status(200)
    .json({ message: "Logged out successfully", token: null });
};


// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// In authController.js
export const updateProfile = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};
