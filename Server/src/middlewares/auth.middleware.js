import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 

    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    console.log("🔑 TOKEN RECEIVED:", token ? "Yes" : "No");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, token missing" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("✅ DECODED TOKEN:", decoded);

    // Find user
    req.user = await User.findById(decoded._id || decoded.id).select("-password -refreshToken");

    if (!req.user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("👤 USER FOUND:", req.user.email);
    next();
    
  } catch (error) {
    console.error("❌ JWT verification error:", error.message);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: "Authentication failed" 
    });
  }
});

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }
  
  // Check role - case insensitive
  const userRole = req.user.role?.toUpperCase();
  if (userRole !== "ADMIN") {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Admin only." 
    });
  }
  
  next();
};

export const isInstructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }
  
  const userRole = req.user.role?.toUpperCase();
  if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Instructor only." 
    });
  }
  
  next();
};


export const isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }
  
  const userRole = req.user.role?.toUpperCase();
  if (userRole !== "STUDENT" && userRole !== "ADMIN") {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Student only." 
    });
  }
  
  next();
};

export const isAdminOrInstructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: "Not authenticated" 
    });
  }
  
  const userRole = req.user.role?.toUpperCase();
  if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Admin or Instructor only." 
    });
  }
  
  next();
};


export const verifyJWT = isAuthenticated;

export default {
  isAuthenticated,
  verifyJWT: isAuthenticated,
  isAdmin,
  isInstructor,
  isStudent,
  isAdminOrInstructor
};