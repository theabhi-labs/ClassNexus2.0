import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js";
import { UserRolesEnum } from "../utils/constants.js";
import { ApiResponse } from "../utils/api-response.js";
import { uploadFileToCloudinary, deleteFileFromCloudinary } from "../utils/storage.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  const emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;

  const user = await User.create({
    name,
    email,
    password,
    role: UserRolesEnum.STUDENT,
    isEmailVerified: false,
    emailVerificationToken,
    emailVerificationExpiry,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  //   await sendVerificationEmail({
  //     to: email,
  //     name,
  //     token: emailVerificationToken,
  //   });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Registration successful. Please verify your email."
    )
  );
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const accessToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }   // 🔐 Short lived
  );

  const refreshToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none", 
    path: "/",
};
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, {
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNum: user.mobileNum,
          role: user.role,
        },
      })
    );
});


const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

const updateProfilePhoto = asyncHandler(async (req, res) => {

  if (!req.file) {
    throw new ApiError(400, "Profile photo is required");
  }

  // ✅ Allow only images
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new ApiError(400, "Only jpeg, png and webp images are allowed");
  }

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ✅ Delete old photo if exists
  if (user.profilePhoto) {
    await deleteFileFromCloudinary(user.profilePhoto);
  }

  // ✅ Upload new photo
  const photoUrl = await uploadFileToCloudinary(
    req.file,
    "profilePhotos"
  );

  user.profilePhoto = photoUrl;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profilePhoto: user.profilePhoto,
      },
      "Profile photo updated successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized request");

  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

const getMe = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) throw new ApiError(401, "Unauthorized");

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id)
    .select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, { user })
  );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken = req.cookies.refreshToken;
  console.log(IncomingRefreshToken)
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: No refresh token");
  }


  try {
    const decodedToken = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (IncomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token")
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // localhost me false
      sameSite: "lax",
    };

    const { newAccessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(
        200,
        { newAccessToken, token: newRefreshToken },
        "Access token refreshed"
      ));

  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token")
  }

});


const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user?.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "You are not allowed to access this resource");
  }

  const users = await User.find()
    .select("-password -refreshToken -emailVerificationToken");

  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalUsers: users.length, users },
      "Users fetched successfully"
    )
  );
});


export {
  registerUser,
  loginUser,
  verifyEmail,
  updateProfilePhoto,
  logoutUser,
  refreshAccessToken,
  getAllUsers,
  getMe
}