import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from '../../user/repository/user.repository.js'
import {sendEmail} from "../../../common/email/nodemailer.js";
import {toMs} from "../../../common/utils/time.js";
import {otpExpired ,invalidCode,invalidPassword} from "../errors.js";
import {  userNotExist,userAlreadyVerified ,userAlreadyExist,userNotVerified } from "../../user/errors.js";
import {generateOTPCode} from "../../../common/utils/otp.js";
import {logger} from "../../../common/logger/logger.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashPassword} from "../utils/hash.js";
import {verifyGoogleToken} from "../../../common/utils/google-auth.js";

export async function register(userData)  {
// We make an error example to check serve erro handler
      /*  const x =20;
    x=15;*/

    const userExist = await authRepository.checkUserExistByEmail(userData.email);
    if (userExist) throw userAlreadyExist;
    userData.password = await hashPassword(userData.password);
    const createdUser = await authRepository.createUser(userData);
    const code = generateOTPCode();

logger.info(code);

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
    const match = await comparePassword(password, user['password']);
    if (!match) throw invalidPassword;


    return generateToken( { id: user._id, email: user.email, name: user.name });
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


export async function resetPassword(email, code, newPassword) {
    // 1. verify otp code
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp) throw otpExpired;
    if (otp.code !== code) throw invalidCode;

    // 2. hashPassword
    const hashedPassword = await hashPassword(newPassword);

    // 3. update user password
    await userRepository.updateUserByEmail(email, {password: hashedPassword});
    //delete OTP
    await otpRepository.deleteOTPsByEmail(email);
}



export async function loginWithCGoogle(idToken) {
    // 1. verify idToken
    const payload = await verifyGoogleToken(idToken);
    // 2. check user exists
    const user = await authRepository.checkUserExistByEmail(payload.email);
    // 3. if exists generate token
    if (user) {
        return generateToken({
            id: user._id,
            email: user.email,
        });
    }
    // 4. if not exist create user generate Token
    const createdUser = await authRepository.createUser({
        name: payload.name,
        email: payload.email,
        provider: 'google',
        isVerified: true,
    });
    return generateToken({
        id: createdUser._id,
        email: createdUser.email,
    });
}