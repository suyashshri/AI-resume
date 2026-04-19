import type { Request, Response } from "express";
import { LoginUser, RegisterUser } from "../types/auth.type";
import prisma from "../db/singleton";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import redisClient from "../db/redis";

/**
 * @name resgisterUserController
 * @description Register a new user, using username,email and password
 * @access Public
 */
async function registerUserController(req: Request, res: Response) {
  const data = req.body;
  const parsedData = RegisterUser.safeParse(data);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }

  const { username, email, password } = parsedData.data;

  const isUserAlreadyExist = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "Account already exist with this email or username",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    config.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @description Login a user using email and password
 * @access Public
 */
async function loginUserController(req: Request, res: Response) {
  const data = req.body;
  const parsedData = LoginUser.safeParse(data);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please enter a valid email and password",
    });
  }

  const { email, password } = parsedData.data;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Please enter a valid email and password",
    });
  }

  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(403).json({
      message: "Please enter a valid email and password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User LoggedIn successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 *  @name logoutUserController
 *  @description Logout a user by clearing the token cookie
 *  @access Public
 */
async function logoutUserController(req: Request, res: Response) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Missing Token",
    });
  }

  const decoded = jwt.decode(token) as { exp: number };

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  await redisClient.set(token, "blacklisted", {
    expiration: { type: "EX", value: ttl },
  });

  res.clearCookie("token");

  res.status(201).json({
    message: "User logged out successfully",
  });
}

/**
 * @name getMeController
 * @description Get the currently logged in user's information
 * @access Private
 */
async function getMeController(req: Request, res: Response) {
  const user = await prisma.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });
  if (!user) {
    return res.status(400).json({
      message: "Unable to find the user",
    });
  }
  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
