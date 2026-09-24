import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from '../../user/repository/user.repository.js'
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import {sendEmail} from "../../../common/email/nodemailer.js";
import {toMs} from "../../../common/utils/time.js";
import {otpExpired ,invalidCode,invalidPassword} from "../errors.js";
import {  userNotExist,userAlreadyVerified ,userAlreadyExist,userNotVerified } from "../../user/errors.js";
import {generateOTPCode} from "../../../common/utils/otp.js";







export async function register(userData)  {

    const userExist = await authRepository.checkUserExistByEmail(userData.email);
    if (userExist) throw userAlreadyExist;
    userData.password = await bcrypt.hash(userData.password, 10);
    const createdUser = await authRepository.createUser(userData);
    const code = generateOTPCode();
    await otpRepository.createOTP({
        code: code,
        email: userData.email,
        expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
    });


   await sendEmail(
        userData.email,
        'verification code',
        `<h1>Your verification code is ${code} </h1>`
    );
    return createdUser;}


export async function verifyAccount(email, code) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    if (user.isVerified === true) throw userAlreadyVerified;
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;
    if (otp.code !== code) throw invalidCode;
    const updatedUser = await userRepository.updateUserByEmail(email, {isVerified: true});
    await otpRepository.deleteOTPsByEmail(email);
    return updatedUser;
}

export async function login(email, password) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    if (user.isVerified === false) throw userNotVerified;
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw invalidPassword;
    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: toMs(1, 'hours') }
    );

    return token;
}


export async function sendOtp(email) {
    const user = await authRepository.checkUserExistByEmail(email);
    if (!user) throw userNotExist;
    await otpRepository.deleteOTPsByEmail(email);
    const code = generateOTPCode();
    await otpRepository.createOTP({
        code: code,
        email: email,
        expiresAt: Date.now() + toMs(3, 'minutes')
    });
    await sendEmail(email, 'new otp', `<p>your new otp is ${code}</p>`);
}
