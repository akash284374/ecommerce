import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization || req.cookies.token; // ✅ correct
    // const token = req.cookies.token || req.cookies["authjs.session-token"];
    console.log("🧪 Incoming cookies:", req.headers.authorization || req.cookies.token);

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};
