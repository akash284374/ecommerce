import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]; // Extract token after 'Bearer '
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    console.log("🧪 Extracted token:", token);

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
