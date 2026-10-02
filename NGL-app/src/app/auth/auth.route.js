import {Router} from "express";
import * as authController from "./controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.patch('/verify-account', authController.verifyAccount);
authRouter.post('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.patch('/reset-password', authController.resetPassword);
authRouter.post('/login-with-google', authController.loginWithGoogle);
export default authRouter;