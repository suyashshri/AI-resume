import type { Request, Response } from "express";
import { LoginUser, RegisterUser } from "../types/auth.type";
import prisma from "../db/singleton";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import redisClient from "../db/redis";
import { sendOtpEmail } from "../lib/email";
import { randomInt } from "crypto";

function generateOtp() {
  return randomInt(100000, 999999).toString();
}

function setJwtCookie(res: Response, userId: string, username: string) {
  const token = jwt.sign({ id: userId, username }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
}

/**
 * @name resgisterUserController
 * @description Register a new user, using username,email and password
 * @access Public
 */
async function registerUserController(req: Request, res: Response) {
  try {
    const parsedData = RegisterUser.safeParse(req.body);
    if (!parsedData.success) {
      const message =
        parsedData.error.issues[0]?.message ??
        "Please enter a valid Username,email and password";
      return res.status(400).json({ message });
    }

    const { username, email, password } = parsedData.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(400).json({
        message: "Account already exists with this email or username",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const otp = generateOtp();
    await redisClient.set(`otp:${email}`, otp, {
      expiration: { type: "EX", value: 600 },
    });
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Account created. Check your email for the verification code.",
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function verifyOtpController(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
      });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Try again." });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    await redisClient.del(`otp:${email}`);

    setJwtCookie(res, user.id, user.username);

    return res.status(200).json({
      message: "Email verified successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function resendOtpController(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const otp = generateOtp();
    await redisClient.set(`otp:${email}`, otp, {
      expiration: { type: "EX", value: 600 },
    });
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("resendOtp error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/**
 * @name loginUserController
 * @description Login a user using email and password
 * @access Public
 */
async function loginUserController(req: Request, res: Response) {
  try {
    const parsedData = LoginUser.safeParse(req.body);
    if (!parsedData.success) {
      const message =
        parsedData.error.issues[0]?.message ??
        "Please enter a valid email and password";
      return res.status(400).json({ message });
    }

    const { email, password } = parsedData.data;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Please enter a valid email and password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Please enter a valid email and password",
      });
    }

    if (!user.isVerified) {
      const otp = generateOtp();
      await redisClient.set(`otp:${email}`, otp, {
        expiration: { type: "EX", value: 600 },
      });
      await sendOtpEmail(email, otp);

      return res.status(403).json({
        message: "Email not verified. We've sent a new code to your email.",
        requiresVerification: true,
        email: user.email,
      });
    }

    setJwtCookie(res, user.id, user.username);

    return res.status(200).json({
      message: "User logged in successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/**
 *  @name logoutUserController
 *  @description Logout a user by clearing the token cookie
 *  @access Public
 */
async function logoutUserController(req: Request, res: Response) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "Missing Token" });
    }

    const decoded = jwt.decode(token) as { exp: number };
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    await redisClient.set(token, "blacklisted", {
      expiration: { type: "EX", value: ttl },
    });

    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

/**
 * @name getMeController
 * @description Get the currently logged in user's information
 * @access Private
 */
async function getMeController(req: Request, res: Response) {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.user?.id } });
    if (!user) {
      return res.status(400).json({ message: "Unable to find the user" });
    }
    return res.status(200).json({
      message: "User details fetched successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function updateProfileController(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { username } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    const existing = await prisma.user.findFirst({
      where: { username, NOT: { id: userId } },
    });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { username: username.trim() },
    });

    return res.status(200).json({
      message: "Profile updated",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function changePasswordController(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function deleteAccountController(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const token = req.cookies.token;

    await prisma.user.delete({ where: { id: userId } });

    const decoded = jwt.decode(token) as { exp: number };
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redisClient.set(token, "blacklisted", {
        expiration: { type: "EX", value: ttl },
      });
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error("deleteAccount error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export {
  registerUserController,
  verifyOtpController,
  resendOtpController,
  loginUserController,
  logoutUserController,
  getMeController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
};
