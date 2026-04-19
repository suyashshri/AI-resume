import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUser);

export default authRouter;
