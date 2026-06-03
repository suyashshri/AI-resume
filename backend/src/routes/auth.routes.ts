import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as authmiddleware from "../middleware/auth.middleware";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/verify-otp
 * @description Verify the user
 * @access Public
 */
authRouter.post("/verify-otp", authController.verifyOtpController);

/**
 * @route POST /api/auth/resend-otp
 * @description Resend OTP
 * @access Public
 */
authRouter.post("/resend-otp", authController.resendOtpController);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout a user
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged in user's information
 * @access Private
 */
authRouter.get(
  "/get-me",
  authmiddleware.authoriseUser,
  authController.getMeController,
);

export default authRouter;
