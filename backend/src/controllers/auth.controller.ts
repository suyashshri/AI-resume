import type { Request, Response } from "express";
import { LoginUser, RegisterUser } from "../types/auth.type";
import prisma from "../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

/**
 * @name resgisterUserController
 * @description Register a new user, using username,email and password
 * @access Public
 */
async function registerUser(req: Request, res: Response) {
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
async function loginUser(req: Request, res: Response) {
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

export { registerUser, loginUser };
