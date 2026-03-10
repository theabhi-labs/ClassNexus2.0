import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.model.js";

 const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } 

  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  console.log("TOKEN RECEIVED:", token);
  console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
     console.log("DECODED:", decoded);

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("USER FOUND:", req.user);

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

const isAdmin = (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
if (!req.user.role || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin resource' });
next();
};

export {
  isAuthenticated,
  isAdmin
}