import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import redisClient from "../db/redis";
import { config } from "../config/config";
import { AuthSchema } from "../types/auth.type";

async function authoriseUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Missing Token",
    });
  }

  const isBlacklisted = await redisClient.get(token);

  if (isBlacklisted) {
    return res.status(400).json({
      message: "Token Expired! Please sign in",
    });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const result = AuthSchema.safeParse(decoded);
    if (!result.success) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = result.data;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token! Please sign in again",
    });
  }
}

export { authoriseUser };
