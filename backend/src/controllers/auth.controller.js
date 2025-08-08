import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const signup = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;

    // 1. Check all fields
    if (!(email && password && fullName)) {
        throw new ApiError(400, "All fields are required");
    }

    // 2. Check password length
    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // 4. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // 5. Generate avatar
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // 6. Create new user
    const newUser = await User.create({
        fullName,
        email,
        password, // Make sure you hash password in your model pre-save
        profilePic: randomAvatar,
    });

    // 7. Generate token
    const token = jwt.sign({ user_id: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    // 8. Set cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // prevent issues on localhost
    });

    // 9. Send response
    return res
        .status(201)
        .json(new ApiResponse(201, newUser, "User created successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { password, email } = req.body;

    if (!(password && email)) {
        throw new ApiError(400, "all fieds are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "invalid email or password");
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "password is incorrect");
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    // 8. Set cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // prevent issues on localhost
    });

    res
        .status(200)
        .json(new ApiResponse(200, user, "user logged in succesfully"));
});

export const logout = asyncHandler((req, res) => {
    res.clearCookie("jwt");
    res.status(200)
        .json(new ApiResponse(200, "successfully logged out"));
});
