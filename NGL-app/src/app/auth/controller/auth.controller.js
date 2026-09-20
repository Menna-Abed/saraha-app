import * as authService from "../service/auth.service.js";
import {toMs} from "../../../common/utils/time.js";

export async function register(req, res, next)   {
    try {
        const createdUser = await authService.register(req.body);
        res.status(201).json({
            message: 'User Created Successfully',
            success: true,
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
}

export async function verifyAccount(req, res, next) {
    try {
        const {email, code} = req.body;
        const updatedUser = await authService.verifyAccount(email, code);
        res.json({
            message: 'User Verified Successfully',
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}


export async function login(req, res, next) {
    try {
        const {email, password} = req.body;
        const token = await authService.login(email, password);
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: toMs(1, 'hours'),
        });
        res.json({
            message: 'User Login Successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export async function sendOtp(req, res, next) {
    try {
        const {email} = req.body;
        await authService.sendOtp(email);
        res.json({message: "new otp sent,check user email", success: true});
    } catch (err) {
        next(err);
    }
}
