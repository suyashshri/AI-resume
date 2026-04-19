import type { Request, Response } from "express";
import { RegisterUser } from "../types/auth.type";

async function registerUser(req: Request, res: Response) {
  const data = req.body;
  const parsedData = RegisterUser.safeParse(data);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }
}

export { registerUser };
