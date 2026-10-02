import {AppError} from "../../common/error/error.js";

export const otpExpired = new AppError('OTP expired, please resend OTP',404);
export const invalidCode = new AppError('invalid code',400);
export const invalidPassword = new AppError('invalid password',403);